import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true, // Enable Vitest's global test functions (like Jest)
        environment: 'node', // Use Node.js environment for testing
        exclude: ['node_modules', 'dist'], // Exclude unnecessary folders
        setupFiles: './tests/test-setup.js', // Preload your test setup file
        watch: false, // Disable watching files during test runs
    },
});