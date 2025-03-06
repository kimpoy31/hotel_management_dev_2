import AlertDialog from "@/components/AlertDialog";
import { Link, router, usePage } from "@inertiajs/react";
import { LogOut, LucideHome } from "lucide-react";
import React from "react";

const SidebarContent = ({
    triggerModalClick,
}: {
    triggerModalClick?: () => void;
}) => {
    const { url } = usePage();

    return (
        <div className="w-full h-full ">
            <div className="navbar shadow-sm justify-center">
                Hotel management
            </div>
            <div className="flex flex-col p-1">
                <Link
                    href={route("dashboard")}
                    className={`btn rounded-none btn-ghost w-full justify-start hover:bg-secondary  ${
                        url === "/" && "text-secondary-content bg-secondary"
                    }`}
                    onClick={() => triggerModalClick?.()}
                >
                    <LucideHome size={16} /> Dashboard
                </Link>

                <div className="divider my-2"></div>
                <AlertDialog
                    buttonTitle="Logout"
                    buttonClassname="btn bg-base-100 w-full gap-2 justify-start rounded-none"
                    buttonIcon={<LogOut size={16} />}
                    modalTitle="Confirm logout"
                    modalDescription="Are you sure you want to logout?. This will end current session"
                    confirmAction={async () => {
                        await router.post("logout");
                        triggerModalClick?.();
                    }}
                    cancelButtonName="Cancel"
                />
            </div>
        </div>
    );
};

export default SidebarContent;
