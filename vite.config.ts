import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globals: true,
        cache: {
            dir: 'node_modules/.vitest',
        },
        environment: 'node',
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    }
})