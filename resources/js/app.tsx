import "../css/app.css";
import "./bootstrap";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createRoot } from "react-dom/client";
import DefaultLayout from "./layouts/DefaultLayout";
import { ApiProvider } from "./context/ApiProvider";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob("./Pages/**/*.tsx", { eager: true });
        let page: any = pages[`./Pages/${name}.tsx`]; // Cast page as 'any'

        // If the page is the Login page, do not use any layout
        if (name === "Login") {
            page.default.layout = undefined; // No layout for Login page
        } else {
            // Use AuthenticatedLayout for all other pages by default
            page.default.layout = (page: any) => (
                <ApiProvider>
                    <DefaultLayout>{page}</DefaultLayout>
                </ApiProvider>
            );
        }

        return page;
    },
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(<App {...props} />);
    },
    progress: {
        color: "#4B5563",
    },
});
