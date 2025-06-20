import React, { ReactNode, useEffect, useRef, useState } from "react";
import { LogOut, Menu } from "lucide-react";

import AlertDialog from "@/components/AlertDialog";
import SidebarContent from "./components/SidebarContent";
import { useApi } from "@/context/ApiProvider";
import CutoffTimeToast from "@/components/CutoffTimeToast";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
    const triggerModalClick = () => {
        const modalCheckbox = document.getElementById(
            "modalId"
        ) as HTMLInputElement;
        if (modalCheckbox) {
            modalCheckbox.click();
        }
    };

    const { notifications } = useApi();

    const dropdownRef = useRef<HTMLDetailsElement>(null);

    // Close dropdown when clicking anywhere
    useEffect(() => {
        const handleClickAnywhere = () => {
            if (dropdownRef.current) {
                dropdownRef.current.removeAttribute("open");
            }
        };

        document.addEventListener("click", handleClickAnywhere);
        return () => {
            document.removeEventListener("click", handleClickAnywhere);
        };
    }, []);

    return (
        <div className="flex w-full h-screen">
            <div className="h-screen w-full max-w-72 bg-base-100 lg:block hidden">
                <SidebarContent />
            </div>
            <div className="drawer">
                <input id="modalId" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content h-screen flex flex-col">
                    {/* Navbar */}
                    <div className="navbar bg-base-100 w-full flex lg:justify-end justify-between">
                        <div className="lg:hidden">
                            <label
                                htmlFor="modalId"
                                aria-label="open sidebar"
                                className="btn btn-square btn-ghost"
                            >
                                <Menu />
                            </label>
                        </div>
                    </div>
                    <div className="h-[100vh-68px] w-full lg:p-2 py-2 overflow-y-auto">
                        {children}
                    </div>
                </div>
                <div className="drawer-side">
                    <label
                        htmlFor="modalId"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>
                    <ul className="menu bg-base-100 h-screen w-full max-w-56 p-0">
                        <SidebarContent
                            triggerModalClick={() => triggerModalClick()}
                        />
                    </ul>
                </div>
            </div>
            <div className="toast toast-top toast-end">
                {notifications.map((notification, index) => (
                    <CutoffTimeToast notification={notification} key={index} />
                ))}
            </div>
        </div>
    );
};

export default DefaultLayout;
