import { defineConfig } from 'tsup'

export default defineConfig((ctx) => ({
    entry: ['src/index.ts'],
    splitting: false,
    dts: true,
    format: !ctx.watch ? ["cjs", "esm"] : "esm",
    minify: !ctx.watch,
    clean: !ctx.watch,
}))