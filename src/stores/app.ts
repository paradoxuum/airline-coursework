import { QueryClient } from "@tanstack/query-core";
import { atom } from "nanostores";

export const client = new QueryClient();
export const currentTheme = atom<"light" | "dark">("light");
