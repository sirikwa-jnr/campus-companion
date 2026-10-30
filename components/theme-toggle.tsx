"use client";

import { useTheme } from "./theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    const next = theme === "light" ? "dark" : theme === "dark" ? "system" : "light";
    setTheme(next);
  };

  return (
    <button
      onClick={cycle}
      className="p-2 rounded-md hover:bg-accent text-sm"
      aria-label="Toggle theme"
      title={`Theme: ${theme}`}
    >
      {theme === "light" && "☀️"}
      {theme === "dark" && "🌙"}
      {theme === "system" && "💻"}
    </button>
  );
}