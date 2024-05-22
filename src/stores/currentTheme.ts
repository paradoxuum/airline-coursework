import { persistentAtom } from "@nanostores/persistent";

export const currentTheme = persistentAtom<"light" | "dark">("light");
