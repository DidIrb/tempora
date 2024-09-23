import pluginJs from "@eslint/js"
import prettierPlugin from "eslint-plugin-prettier"
import globals from "globals"
import tseslint from "typescript-eslint"

export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "error",
    },
  },
  {
    ignores: ["node_modules", "eslint.config.mjs", "**/dist", "config/*"],
  },
]
