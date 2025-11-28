import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        target: "es2018",
        minify: "esbuild",
        sourcemap: false,
        assetsInlineLimit: 4096,
        brotliSize: false,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        if (id.includes("firebase")) return "vendor_firebase";
                        if (id.includes("react")) return "vendor_react";
                        return "vendor";
                    }
                },
            },
        },
    },
    optimizeDeps: {
        // Avoid pre-bundling entire `firebase` package (modern firebase package
        // has complex exports that can break Vite's optimize step). Keep
        // commonly used ESM entries if necessary or remove firebase entirely.
        include: ["react", "react-dom", "react-router-dom"],
    },
});
