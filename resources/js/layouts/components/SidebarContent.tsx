import AlertDialog from "@/components/AlertDialog";
import { Link, router, usePage } from "@inertiajs/react";
import { LogOut, LucideHome, Monitor, ShieldUser } from "lucide-react";

const SidebarContent = ({
    triggerModalClick,
}: {
    triggerModalClick?: () => void;
}) => {
    const { url } = usePage();
    const roles = usePage().props.auth.user.roles;

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
                    <LucideHome size={20} /> Dashboard
                </Link>
                {roles.includes("administrator") && (
                    <Link
                        href={route("admin")}
                        className={`btn rounded-none btn-ghost w-full justify-start hover:bg-secondary  ${
                            url.includes("admin") &&
                            "text-secondary-content bg-secondary"
                        }`}
                        onClick={() => triggerModalClick?.()}
                    >
                        <ShieldUser size={20} /> Admin
                    </Link>
                )}
                {(roles.includes("administrator") ||
                    roles.includes("frontdesk")) && (
                    <Link
                        href={route("frontdesk")}
                        className={`btn rounded-none btn-ghost w-full justify-start hover:bg-secondary  ${
                            url.includes("frontdesk") &&
                            "text-secondary-content bg-secondary"
                        }`}
                        onClick={() => triggerModalClick?.()}
                    >
                        <Monitor size={20} /> Frontdesk
                    </Link>
                )}

                <div className="divider my-2"></div>
                <AlertDialog
                    buttonTitle="Logout"
                    buttonClassname="btn bg-base-100 w-full gap-1 justify-start rounded-none"
                    buttonIcon={<LogOut size={20} />}
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
