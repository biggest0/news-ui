/**
 * Unit tests for OnboardingTour — carousel navigation, dismissal reasons, the
 * auth-dependent slide list, and the a11y wiring (dots as buttons, live step
 * counter, arrow-key navigation).
 */
import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import OnboardingTour from "@/components/onboarding/OnboardingTour";
import { AppSettingProvider } from "@/contexts/AppSettingContext";
import { renderWithProviders, mockUseAuth } from "@/__tests__/helpers/renderWithProviders";

const close = vi.fn();
let isAuthenticated = false;

vi.mock("@/contexts/OnboardingContext", () => ({
	useOnboarding: () => ({ isOpen: true, open: vi.fn(), close, hasSeen: false }),
}));

vi.mock("@/contexts/AuthContext", () => ({
	useAuth: () => mockUseAuth({ isAuthenticated })(),
}));

/** All slide headings in manifest order, for count assertions. */
const SLIDE_TITLES = [
	"Welcome to Catire Time",
	"Make it yours",
	"Choose how you read",
	"Arrange the home page",
	"Find what you like",
	"Make it personal",
];

const dots = () => screen.getAllByRole("button", { name: /^Go to step/ });
const nextButton = () => screen.getByRole("button", { name: "Next" });

/**
 * The preferences, reading and sections slides embed the real app-settings
 * controls, so the tour needs AppSettingProvider. renderWithProviders
 * deliberately doesn't supply it, so wrap here rather than widening the
 * shared helper for all 23 suites.
 */
const renderTour = () =>
	renderWithProviders(
		<AppSettingProvider>
			<OnboardingTour />
		</AppSettingProvider>
	);

/** Waits for the slide heading to take focus (base-ui focuses asynchronously). */
const expectHeadingFocused = (title: string) =>
	waitFor(() => expect(screen.getByRole("heading", { name: title })).toHaveFocus());

beforeEach(() => {
	vi.clearAllMocks();
	isAuthenticated = false;
	localStorage.clear();
});

describe("OnboardingTour — rendering", () => {
	it("opens on the first slide", () => {
		renderTour();

		expect(screen.getByText(SLIDE_TITLES[0])).toBeInTheDocument();
		expect(screen.getByText("Step 1 of 6")).toBeInTheDocument();
	});

	it("shows the dialog title and one dot per slide", () => {
		renderTour();

		expect(screen.getByText("How to use this site")).toBeInTheDocument();
		expect(dots()).toHaveLength(6);
	});

	it("marks only the current dot with aria-current", () => {
		renderTour();

		const current = dots().filter((d) => d.getAttribute("aria-current") === "step");
		expect(current).toHaveLength(1);
		expect(dots()[0]).toHaveAttribute("aria-current", "step");
	});

	it("announces the step counter politely", () => {
		renderTour();
		expect(screen.getByText("Step 1 of 6")).toHaveAttribute("aria-live", "polite");
	});

	it("puts focus on the slide heading when it opens", async () => {
		renderTour();
		await expectHeadingFocused(SLIDE_TITLES[0]);
	});

	it("moves focus to the new heading on each step change", async () => {
		const user = userEvent.setup();
		renderTour();
		await expectHeadingFocused(SLIDE_TITLES[0]);

		await user.click(nextButton());

		// without this, focus would stay parked on Next and a screen reader
		// would never hear the new slide
		await expectHeadingFocused(SLIDE_TITLES[1]);
	});
});

describe("OnboardingTour — navigation", () => {
	it("Next advances a slide and updates the counter", async () => {
		const user = userEvent.setup();
		renderTour();

		await user.click(nextButton());

		expect(screen.getByText(SLIDE_TITLES[1])).toBeInTheDocument();
		expect(screen.getByText("Step 2 of 6")).toBeInTheDocument();
	});

	it("hides Back on the first slide and shows it afterwards", async () => {
		const user = userEvent.setup();
		renderTour();

		expect(screen.queryByRole("button", { name: "Back" })).not.toBeInTheDocument();
		await user.click(nextButton());
		expect(screen.getByRole("button", { name: "Back" })).toBeInTheDocument();
	});

	it("Back returns to the previous slide", async () => {
		const user = userEvent.setup();
		renderTour();

		await user.click(nextButton());
		await user.click(screen.getByRole("button", { name: "Back" }));

		expect(screen.getByText(SLIDE_TITLES[0])).toBeInTheDocument();
	});

	it("a dot jumps straight to its slide", async () => {
		const user = userEvent.setup();
		renderTour();

		await user.click(dots()[3]);

		expect(screen.getByText(SLIDE_TITLES[3])).toBeInTheDocument();
		expect(screen.getByText("Step 4 of 6")).toBeInTheDocument();
	});

	it("arrow keys walk the carousel", async () => {
		const user = userEvent.setup();
		renderTour();

		// The handler lives on the dialog popup, and base-ui moves focus there
		// asynchronously — sending keys before that lands types into <body>.
		await expectHeadingFocused(SLIDE_TITLES[0]);

		await user.keyboard("{ArrowRight}");
		expect(screen.getByText(SLIDE_TITLES[1])).toBeInTheDocument();

		await user.keyboard("{ArrowLeft}");
		expect(screen.getByText(SLIDE_TITLES[0])).toBeInTheDocument();
	});

	it("shows Finish instead of Next on the last slide", async () => {
		const user = userEvent.setup();
		renderTour();

		await user.click(dots()[5]);

		expect(screen.getByRole("button", { name: "Got it" })).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: "Next" })).not.toBeInTheDocument();
	});
});

describe("OnboardingTour — dismissal", () => {
	it("Finish closes with 'completed'", async () => {
		const user = userEvent.setup();
		renderTour();

		await user.click(dots()[5]);
		await user.click(screen.getByRole("button", { name: "Got it" }));

		expect(close).toHaveBeenCalledWith("completed");
	});

	it("Skip closes with 'skipped'", async () => {
		const user = userEvent.setup();
		renderTour();

		await user.click(screen.getByRole("button", { name: "Skip tour" }));

		expect(close).toHaveBeenCalledWith("skipped");
	});

	it("Escape closes with 'closed'", async () => {
		const user = userEvent.setup();
		renderTour();

		await user.keyboard("{Escape}");

		expect(close).toHaveBeenCalledWith("closed");
	});
});

describe("OnboardingTour — auth-dependent slides", () => {
	it("drops the account slide for a signed-in visitor", () => {
		isAuthenticated = true;
		renderTour();

		expect(screen.getByText("Step 1 of 5")).toBeInTheDocument();
		expect(dots()).toHaveLength(5);
	});

	it("keeps the sign-up call to action for anonymous visitors", async () => {
		const user = userEvent.setup();
		renderTour();

		await user.click(dots()[5]);

		expect(screen.getByText(SLIDE_TITLES[5])).toBeInTheDocument();
		expect(
			screen.getByRole("link", { name: "Create an account" })
		).toBeInTheDocument();
	});
});

describe("OnboardingTour — live controls", () => {
	it("renders the language and theme pickers on the preferences slide", async () => {
		const user = userEvent.setup();
		renderTour();

		await user.click(dots()[1]);

		expect(screen.getByRole("button", { name: "English" })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "French" })).toBeInTheDocument();
	});

	it("renders the reading-mode picker on the reading slide", async () => {
		const user = userEvent.setup();
		renderTour();

		await user.click(dots()[2]);

		const scroll = screen.getByRole("button", { name: "Endless scroll" });
		const pages = screen.getByRole("button", { name: "Numbered pages" });
		expect(scroll).toBeInTheDocument();
		expect(pages).toBeInTheDocument();
		// exactly one is pressed at a time
		const pressed = [scroll, pages].filter(
			(b) => b.getAttribute("aria-pressed") === "true"
		);
		expect(pressed).toHaveLength(1);
	});

	it("closes the tour when a slide link navigates away", async () => {
		// A Link inside a modal would otherwise leave the dialog stranded over
		// the page it just routed to, so link controls dismiss first.
		const user = userEvent.setup();
		renderTour();

		await user.click(dots()[5]);
		await user.click(
			within(screen.getByRole("dialog")).getByRole("link", {
				name: "Create an account",
			})
		);

		expect(close).toHaveBeenCalledWith("closed");
	});
});
