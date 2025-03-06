import React, { ReactNode, useEffect, useRef, useState } from "react";
import Navbar from "./components/Navbar";
import { LogOut, Menu } from "lucide-react";
import SidebarContent from "./components/SidebarContent";
import AlertDialog from "@/components/AlertDialog";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
    const triggerModalClick = () => {
        const modalCheckbox = document.getElementById(
            "modalId"
        ) as HTMLInputElement;
        if (modalCheckbox) {
            modalCheckbox.click();
        }
    };

    const [isOpen, setIsOpen] = useState(false);
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
            <div className="h-screen w-full max-w-56 bg-base-200 lg:block hidden">
                <SidebarContent />
            </div>
            <div className="drawer">
                <input id="modalId" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content h-screen flex flex-col">
                    {/* Navbar */}
                    <div className="navbar bg-base-200 w-full flex lg:justify-end justify-between">
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
                    <div className="h-[100vh-68px] w-full p-2 overflow-y-auto">
                        {children}
                    </div>
                </div>
                <div className="drawer-side">
                    <label
                        htmlFor="modalId"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>
                    <ul className="menu bg-base-200 h-screen w-full max-w-56 p-0">
                        <SidebarContent
                            triggerModalClick={() => triggerModalClick()}
                        />
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DefaultLayout;
