import { defineConfig } from "vitest/config";

const coverage100 = 100;

/*
 * Cap of SIMULTANEOUS chromium instances (local and CI). Tunable per runner via env.
 * Measured model (isolate:true): 1 chromium per test FILE; within a file the
 * `concurrent` tests share the same browser (1 context per test).
 * So more workers = more browser files in parallel → shorter CI as it scales.
 * Default is 1 (conservative); raise per runner, e.g. TEST_MAX_BROWSERS=2
 * (ubuntu-latest handles 2 headless fine).
 */
const defaultMaxBrowsers = 1;
const maxBrowsers = Number(process.env.TEST_MAX_BROWSERS) || defaultMaxBrowsers;

const vite = defineConfig({
    test: {
        globals: true,
        coverage: {
            enabled: true,
            provider: "istanbul",
            watermarks: {
                branches: [ coverage100, coverage100 ],
                functions: [ coverage100, coverage100 ],
                lines: [ coverage100, coverage100 ],
                statements: [ coverage100, coverage100 ],
            },
            thresholds: {
                "100": true,
            },
            exclude: [
                "src/index.ts",
                "src/index.js",
                "src/Pages/**/*.ts",
                "src/Handlers/**/*.ts",
                "src/app/Services/**/*.ts",
                "src/app/Listeners/**/*.ts",
                "@types/",
                "tests/",
            ],
        },
        projects: [
            {
                test: {
                    name: "unit",
                    globals: true,
                    include: [ "tests/unit/**/*.test.ts" ],
                    setupFiles: [ "./tests/setup/unit.setup.ts" ],
                    sequence: { groupOrder: 0 },
                },
            },
            {
                test: {
                    name: "browser",
                    globals: true,
                    include: [ "tests/browser/**/*.test.ts" ],
                    setupFiles: [ "./tests/setup/browser.setup.ts" ],
                    pool: "threads",
                    maxWorkers: maxBrowsers, // ← cap of simultaneous chromium (see note above)
                    maxConcurrency: 4, // ← parallel contexts within each browser
                    testTimeout: 20_000,
                    hookTimeout: 30_000,
                    sequence: { groupOrder: 1 },
                },
            },
        ],
    },
});

export default vite;
