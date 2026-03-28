/**
 * Vitest global setup file.
 *
 * - Imports @testing-library/jest-dom to add custom DOM matchers
 *   (toBeInTheDocument, toHaveTextContent, etc.) to every test file.
 * - Runs RTL cleanup after each test to unmount rendered components and
 *   clear the DOM, preventing state leaking between tests.
 */
import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

afterEach(() => {
	cleanup();
});
