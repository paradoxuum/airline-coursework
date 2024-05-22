import { Button } from "@/components/ui/button";
import { currentTheme } from "@/stores/currentTheme";
import { useStore } from "@nanostores/react";
import { Moon, Sun } from "lucide-react";
import { useEffect } from "react";

export function ThemeButton() {
	const theme = useStore(currentTheme);

	useEffect(() => {
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);

	return (
		<Button
			size="icon"
			onClick={() => currentTheme.set(theme === "light" ? "dark" : "light")}
		>
			{theme === "light" ? <Sun /> : <Moon />}
		</Button>
	);
}
