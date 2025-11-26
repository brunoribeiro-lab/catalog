import { languages } from "@/constants/languages";

export const locales = languages.map((lang) => lang.code) as readonly string[];
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";
