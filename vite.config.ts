import { defineConfig } from "vitest/config";

export default defineConfig({
    cacheDir: 'node_modules/.vitest',
    test: {
        globals: true,
        environment: 'node',
        include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        coverage: {
            include: [
                'src/**/*'
            ]
        }
    }
})