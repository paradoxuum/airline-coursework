import { atom } from "nanostores";

export const currentTheme = atom<"light" | "dark">("light");
