import typescriptEslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [
    {
        ignores: ["**/out", "**/node_modules"],
    },
    ...compat.extends(
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
    ),
    {
        plugins: {
            "@typescript-eslint": typescriptEslint,
        },

        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: "script",
        },

        rules: {
            indent: ["warn", 4],
            "brace-style": ["warn", "1tbs"],
            curly: ["warn", "multi-or-nest", "consistent"],
            "no-console": "off",
            "nonblock-statement-body-position": ["warn", "below"],
            "import/no-dynamic-require": "off",
            "global-require": "off",
            "no-plusplus": "off",
            "arrow-parens": ["warn", "as-needed"],
            "@typescript-eslint/no-namespace": "off",
            "@typescript-eslint/no-empty-object-type": "off",
        },
    }
];
