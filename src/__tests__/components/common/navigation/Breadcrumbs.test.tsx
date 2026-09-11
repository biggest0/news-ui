/**
 * Breadcrumbs: a labelled <nav> with an ordered list, every crumb but the
 * last a link, the last marked as the current page.
 */
import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";

import { renderWithProviders } from "@/__tests__/helpers/renderWithProviders";
import Breadcrumbs from "@/components/common/navigation/Breadcrumbs";

const items = [
	{ name: "Home", path: "/" },
	{ name: "Science", path: "/science" },
	{ name: "Cats Teleport", path: "/article/abc" },
];

describe("Breadcrumbs", () => {
	it("renders a labelled navigation landmark", () => {
		renderWithProviders(<Breadcrumbs items={items} />);

		expect(screen.getByRole("navigation", { name: "Breadcrumb" })).toBeInTheDocument();
		expect(screen.getAllByRole("listitem")).toHaveLength(3);
	});

	it("links every crumb except the current page", () => {
		renderWithProviders(<Breadcrumbs items={items} />);

		expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
		expect(screen.getByRole("link", { name: "Science" })).toHaveAttribute("href", "/science");
		expect(screen.queryByRole("link", { name: "Cats Teleport" })).toBeNull();
		expect(screen.getByText("Cats Teleport")).toHaveAttribute("aria-current", "page");
	});
});
