import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button Component", () => {
	it("renders with children text", () => {
		render(<Button>Click me</Button>);
		expect(screen.getByText("Click me")).toBeInTheDocument();
	});

	it("calls onClick handler when clicked", async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(<Button onClick={handleClick}>Click me</Button>);

		await user.click(screen.getByText("Click me"));
		expect(handleClick).toHaveBeenCalledTimes(1);
	});

	it("applies primary variant styles by default", () => {
		render(<Button>Primary</Button>);
		const button = screen.getByText("Primary");

		expect(button).toHaveClass("bg-blue-600");
	});

	it("applies secondary variant styles when specified", () => {
		render(<Button variant="secondary">Secondary</Button>);
		const button = screen.getByText("Secondary");

		expect(button).toHaveClass("bg-gray-200");
	});

	it("disables button when disabled prop is true", () => {
		render(<Button disabled>Disabled</Button>);
		const button = screen.getByText("Disabled");

		expect(button).toBeDisabled();
		expect(button).toHaveClass("opacity-50");
	});

	it("does not call onClick when disabled", async () => {
		const handleClick = vi.fn();
		const user = userEvent.setup();

		render(
			<Button onClick={handleClick} disabled>
				Disabled
			</Button>,
		);

		await user.click(screen.getByText("Disabled"));
		expect(handleClick).not.toHaveBeenCalled();
	});
});
