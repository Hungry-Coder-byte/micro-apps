import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

// In Tailwind v4, color tokens are defined via @theme inline in globals.css.
// This config only retains non-color extensions that v4 doesn't auto-handle.
const config: Config = {
  plugins: [typography],
  theme: {
    extend: {},
  },
};
export default config;
