import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        // Enable Vitest's global test functions (like Jest)
        globals: true, 
        // Use Node.js environment for testing
        environment: 'node', 
        // Exclude unnecessary folders
        exclude: ['node_modules', 'dist'],
        // Preload your test setup file
        setupFiles: './tests/test-setup.js',
        // Disable watching files during test runs 
        watch: false, 
    },
});