import React, { ReactNode } from "react";
import Navbar from "./components/Navbar";
import { Menu } from "lucide-react";

const DefaultLayout = ({ children }: { children: ReactNode }) => {
    return (
        <div className="flex w-full h-screen">
            <div className="h-screen w-full max-w-56 bg-base-200 lg:block hidden"></div>
            <div className="drawer">
                <input
                    id="my-drawer-3"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content h-screen flex flex-col">
                    {/* Navbar */}
                    <div className="navbar bg-base-200 w-full flex lg:justify-end justify-between">
                        <div className="lg:hidden">
                            <label
                                htmlFor="my-drawer-3"
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
                    <div className="h-[100vh-68px] overflow-y-auto">
                        {children}
                    </div>
                </div>
                <div className="drawer-side">
                    <label
                        htmlFor="my-drawer-3"
                        aria-label="close sidebar"
                        className="drawer-overlay"
                    ></label>
                    <ul className="menu bg-base-200 min-h-full w-xs p-4">
                        {/* Sidebar content here */}
                        <li>
                            <a>Sidebar Item 1</a>
                        </li>
                        <li>
                            <a>Sidebar Item 2</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default DefaultLayout;
