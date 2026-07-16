export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";
export const BASE_URL = import.meta.env.BASE_URL || "/";

/**
 * App version, injected at build time from package.json (vite `define`) —
 * package.json is the single source of truth (M8, F027). The fallback keeps
 * tests (which don't run through Vite's define) working.
 */
declare const __APP_VERSION__: string | undefined;
export const APP_VERSION = `v${
	typeof __APP_VERSION__ !== "undefined" ? __APP_VERSION__ : "0.0.0-dev"
}`;
