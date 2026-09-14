import { Component, type ErrorInfo, type ReactNode } from "react";

import { RouteErrorFallback } from "@/components/common/feedback/RouteErrorFallback";

/** One reload attempt per tab, so a genuinely broken build cannot loop. */
const RELOAD_GUARD = "routeReloadAttempted";

/**
 * True for the "the file this tab remembers is no longer on the server" family
 * of errors. Browsers word it differently, hence the alternatives: Chrome says
 * "Failed to fetch dynamically imported module", Safari "Importing a module
 * script failed", Firefox "error loading dynamically imported module".
 */
function isStaleChunkError(error: unknown): boolean {
	const message = error instanceof Error ? error.message : String(error);
	return /dynamically imported module|Importing a module script failed|ChunkLoadError/i.test(
		message
	);
}

interface RouteErrorBoundaryProps {
	children: ReactNode;
}

interface RouteErrorBoundaryState {
	failed: boolean;
}

/**
 * Catches render and lazy-import failures below it so one broken route cannot
 * blank the whole site.
 *
 * Without a boundary, React 19 unmounts the entire tree on an uncaught error,
 * leaving `#root` empty: the reported symptom was a blank page with no loading
 * indicator after clicking a category, which a refresh fixed. Every route but
 * the home page is a `lazy()` chunk, and `gh-pages` replaces the branch on each
 * deploy, so a tab left open across a deploy is holding filenames that have
 * since been deleted. The next navigation asks for a chunk that 404s.
 *
 * A stale chunk is therefore repaired by exactly what the reporter did by hand,
 * so it reloads automatically, once per tab. Anything else keeps the shell up
 * and offers the reload rather than guessing.
 */
export class RouteErrorBoundary extends Component<
	RouteErrorBoundaryProps,
	RouteErrorBoundaryState
> {
	state: RouteErrorBoundaryState = { failed: false };

	static getDerivedStateFromError(): RouteErrorBoundaryState {
		return { failed: true };
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		// Kept: this is the only trace of the failure a visitor can send back.
		console.error("Route failed to render", error, info.componentStack);

		if (!isStaleChunkError(error)) return;

		// A fresh index.html points at the new filenames, which is the whole fix.
		// The guard matters because if the chunk is missing for some other reason
		// the reload would not help, and an unguarded one would spin forever.
		if (sessionStorage.getItem(RELOAD_GUARD)) return;
		sessionStorage.setItem(RELOAD_GUARD, "1");
		window.location.reload();
	}

	// if failed, render the fall back component, else render the children component
	render() {
		return this.state.failed ? <RouteErrorFallback /> : this.props.children;
	}
}
