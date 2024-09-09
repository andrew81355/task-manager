import globals from "globals";
import pluginJs from "@eslint/js";
import pluginVue from "eslint-plugin-vue";
import pluginCypress from "eslint-plugin-cypress";

export default [
    // Apply to JavaScript, Vue, and Cypress files
    {
        files: ["**/*.{js,mjs,cjs,vue}"],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
            ecmaVersion: 2021, // Optional: specify ECMAScript version
        },
        plugins: {
            vue: pluginVue,
            cypress: pluginCypress,
        },
        processor: pluginVue.processors[".vue"], // Vue-specific processing for .vue files
        rules: {
            // Add any custom rules here
        },
    },

    // Add JS recommended config
    pluginJs.configs.recommended,

    // Add Vue recommended config
    pluginVue.configs.recommended,

    // Add Cypress recommended config
    pluginCypress.configs.recommended,
];