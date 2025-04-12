import { defineConfig } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
    plugins: [
        laravel({
            input: "resources/js/app.tsx",
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        host: "192.168.1.6",
        port: 5173,
        strictPort: true,
        hmr: {
            protocol: "ws",
            host: "192.168.1.6",
        },
    },
});
