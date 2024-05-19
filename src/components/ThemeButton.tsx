import { useStore } from "@nanostores/react";
import { Button } from "@nextui-org/react";
import { Moon, Sun } from "lucide-react";
import { currentTheme } from "../stores/app";

export function ThemeButton() {
	const theme = useStore(currentTheme);

	return (
		<Button
			isIconOnly
			onPress={() => currentTheme.set(theme === "light" ? "dark" : "light")}
		>
			{theme === "light" ? <Sun /> : <Moon />}
		</Button>
	);
}
