import { defineConfig, loadEnv } from "vite";
import laravel from "laravel-vite-plugin";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
    // Load .env based on the current mode (e.g., development, production)
    const env = loadEnv(mode, process.cwd(), "");

    return {
        plugins: [
            laravel({
                input: "resources/js/app.tsx",
                refresh: true,
            }),
            react(),
            tailwindcss(),
        ],
        server: {
            host: env.APP_HOST,
            port: 5173,
            strictPort: true,
            hmr: {
                protocol: "ws",
                host: env.APP_HOST,
            },
        },
    };
});
