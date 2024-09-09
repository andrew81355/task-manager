import globals from "globals";
import pluginJs from "@eslint/js";
import vitestPlugin from "eslint-plugin-vitest";

export default [
    {
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
                ...vitestPlugin.environments.env.globals
            },
        },
    },

    pluginJs.configs.recommended,
    // Add Vitest recommended configuration
    vitestPlugin.configs.recommended
];