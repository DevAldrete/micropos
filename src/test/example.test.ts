import { describe, expect, it } from "vitest";

describe("Example Test Suite", () => {
	it("should pass a basic assertion", () => {
		expect(1 + 1).toBe(2);
	});

	it("should work with strings", () => {
		const projectName = "MicroPOS";
		expect(projectName).toBe("MicroPOS");
		expect(projectName.toLowerCase()).toContain("pos");
	});

	it("should handle async operations", async () => {
		const mockFetch = async () => {
			return { success: true };
		};

		const result = await mockFetch();
		expect(result.success).toBe(true);
	});
});
