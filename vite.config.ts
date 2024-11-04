import { vitePlugin as remix } from "@remix-run/dev";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "path";
import { createRouter } from "./lib/router";

export default defineConfig({
    server: {
        fs: {
            allow: [
                "eslintrc.cjs",
                ".gitignore",
                "postcss.config.js",
                "README.md",
                "tailwind.config.ts",
                "tsconfig.json",
                "app",
                "public",
                "node_modules",
            ],
            deny: [
                ".env",
                "package.json",
                "*.{crt,pem}",
                ".env.*",
                "private",
                "package-lock.json",
            ],
        },
    },
    plugins: [
        remix({
            future: {
                v3_fetcherPersist: true,
                v3_relativeSplatPath: true,
                v3_throwAbortReason: true,
            },
            ignoredRouteFiles: ["routes/**.*"], // ignore the default route files
            async routes() {
                const appDirectory = path.join(__dirname, "app");
                return createRouter(appDirectory);
            },
        }),
        tsconfigPaths(),
    ],
});
