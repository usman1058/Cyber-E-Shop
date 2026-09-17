import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // TypeScript 相关规则
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/prefer-as-const": "warn",
      
      // React 相关规则
      "react-hooks/exhaustive-deps": "warn",
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      "react/prop-types": "off",
      
      // Next.js 相关规则
      "@next/next/no-img-element": "off",
      "@next/next/no-html-link-for-pages": "off",
      
      // 一般JavaScript规则
      "prefer-const": "warn",
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-empty": ["warn", { allowEmptyCatch: true }],
      "no-irregular-whitespace": "warn",
      "no-case-declarations": "off",
      "no-fallthrough": "warn",
      "no-mixed-spaces-and-tabs": "warn",
      "no-redeclare": "warn",
      "no-undef": "warn",
      "no-unreachable": "warn",
      "no-useless-escape": "warn",
    },
  },
];

export default eslintConfig;