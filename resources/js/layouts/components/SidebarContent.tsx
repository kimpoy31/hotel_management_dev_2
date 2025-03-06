import { Link, usePage } from "@inertiajs/react";
import React from "react";

const SidebarContent = ({
    triggerModalClick,
}: {
    triggerModalClick?: () => void;
}) => {
    const { url } = usePage();

    return (
        <div className="w-full h-full">
            <div className="navbar shadow-sm justify-center w-full ">
                Hotel management
            </div>
            <div className="p-1">
                <Link
                    href={route("dashboard")}
                    className={`btn rounded-none btn-ghost w-full justify-start hover:bg-secondary  ${
                        url === "/" && "text-secondary-content bg-secondary"
                    }`}
                    onClick={() => triggerModalClick?.()}
                >
                    Dashboard
                </Link>
            </div>
        </div>
    );
};

export default SidebarContent;
