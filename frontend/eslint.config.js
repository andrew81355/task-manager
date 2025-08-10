import globals from "globals";
import js from "@eslint/js";
import pluginCypress from "eslint-plugin-cypress";

export default [
    {
        files: ["**/*.{js,cy.js}"],
        languageOptions: {
            ecmaVersion: 2021,
            globals: {
                ...globals.browser,
                ...pluginCypress.environments.globals.globals
            },
        },
        rules: js.configs.recommended.rules,

    },

    // Apply recommended rules to JS files with an override
    {
        files: ["**/*.js"],
        rules: {
            ...js.configs.recommended.rules,
            "no-unused-vars": "warn"
        }
    },

    // Apply all rules to JS files
    {
        files: ["**/*.js"],
        rules: {
            ...js.configs.all.rules,
            "no-unused-vars": "warn"
        }
    },
];
