import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import tailwind from "eslint-plugin-tailwindcss";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  ...tailwind.configs["flat/recommended"],
  {
    settings: {
      tailwindcss: {
        callees: ["cn", "cva", "twMerge"],
        config: {}, 
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "react/self-closing-comp": "warn",
      "react/jsx-no-useless-fragment": "warn",
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": "off",
    },
  },
  globalIgnores([
    ".next/**",
    "node_modules/**",
    "public/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
