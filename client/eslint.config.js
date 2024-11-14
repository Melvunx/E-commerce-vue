import pluginJs from "@eslint/js";
import tailwind from "eslint-plugin-tailwindcss";
import { default as pluginVue, default as vue } from "eslint-plugin-vue";
import globals from "globals";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,vue}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...tailwind.configs["flat/recommended"],
  ...vue.configs["flat/recommended"],
  ...pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      "vue/singleline-html-element-content-newline": "off",
      "vue/multiline-html-element-content-newline": "off",
      "vue/multi-word-component-names": "off",
      "vue/require-default-prop": "off",
    },
  },
];
