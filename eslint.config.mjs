import eslint from "@eslint/js";
import tseslint from "typescript-eslint";
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { "@stylistic": stylistic },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@stylistic/indent": ["error", 2],
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/no-multiple-empty-lines": ["error", { max: 1 }],
      "@stylistic/space-infix-ops": "error",
      "@stylistic/space-before-blocks": "error",
      "@stylistic/keyword-spacing": "error",
      "@stylistic/comma-spacing": "error",
      "@stylistic/brace-style": "error",
      "@stylistic/object-curly-spacing": ["error", "always"],
      "@stylistic/arrow-spacing": "error",
      "curly": ["error", "all"],
      "max-len": ["warn", { code: 100, ignoreStrings: true, ignoreUrls: true }],
    },
  },
  {
    ignores: ["dist/", "node_modules/"],
  }
);
