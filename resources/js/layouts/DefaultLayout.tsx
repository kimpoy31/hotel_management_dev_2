import React, { ReactNode } from "react";
import Navbar from "./components/Navbar";
import { Menu } from "lucide-react";
import SidebarContent from "./components/SidebarContent";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
    const triggerModalClick = () => {
        const modalCheckbox = document.getElementById(
            "modalId"
        ) as HTMLInputElement;
        if (modalCheckbox) {
            modalCheckbox.click();
        }
    };

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
                        <div className="mx-4">
                            <button>Logout</button>
                        </div>
                    </div>
                    <div className="h-[100vh-68px] w-full overflow-y-auto">
                        {children}
                    </div>
                </div>
                <div className="drawer-side">
                    <label
                        htmlFor="modalId"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>
                    <ul className="menu bg-base-200 min-h-full w-full max-w-56 p-0">
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
