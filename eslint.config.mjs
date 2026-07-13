import js from "@eslint/js";

export default [
  {
    ignores: [".next/**", "out/**", "node_modules/**"]
  },
  js.configs.recommended,
  {
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "off"
    }
  }
];
