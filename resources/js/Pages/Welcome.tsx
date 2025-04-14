import React from "react";
import Frontdesk from "./Frontdesk";
import { usePage } from "@inertiajs/react";

const Welcome = () => {
    const userRole = usePage().props.auth.user.roles;

    return (
        <>
            {userRole.includes("frontdesk") &&
                !userRole.includes("administrator") && <Frontdesk />}
        </>
    );
};

export default Welcome;
