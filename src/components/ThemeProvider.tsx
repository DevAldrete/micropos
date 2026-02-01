import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [theme, setTheme] = useState<"light" | "dark">("light");

	useEffect(() => {
		// Check for saved theme preference or default to system preference
		const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
		const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
			.matches
			? "dark"
			: "light";

		const initialTheme = savedTheme || systemPreference;
		setTheme(initialTheme);
		document.documentElement.classList.toggle("dark", initialTheme === "dark");

		// Listen for system theme changes
		const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e: MediaQueryListEvent) => {
			if (!localStorage.getItem("theme")) {
				const newTheme = e.matches ? "dark" : "light";
				setTheme(newTheme);
				document.documentElement.classList.toggle("dark", e.matches);
			}
		};

		mediaQuery.addEventListener("change", handleChange);
		return () => mediaQuery.removeEventListener("change", handleChange);
	}, []);

	const toggleTheme = () => {
		const newTheme = theme === "light" ? "dark" : "light";
		setTheme(newTheme);
		localStorage.setItem("theme", newTheme);
		document.documentElement.classList.toggle("dark", newTheme === "dark");
	};

	return (
		<ThemeContext.Provider value={{ theme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
}

import { createContext, useContext } from "react";

interface ThemeContextType {
	theme: "light" | "dark";
	toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
	const context = useContext(ThemeContext);
	if (!context) {
		throw new Error("useTheme must be used within ThemeProvider");
	}
	return context;
}
