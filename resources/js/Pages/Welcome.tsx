import React from "react";
import Frontdesk from "./Frontdesk";
import { usePage } from "@inertiajs/react";
import Housekeeping from "./Housekeeping";

const Welcome = () => {
    const userRole = usePage().props.auth.user.roles;

    return (
        <>
            {userRole.includes("frontdesk") &&
                !userRole.includes("administrator") && <Frontdesk />}
            {userRole.includes("housekeeper") &&
                !userRole.includes("administrator") && <Housekeeping />}
        </>
    );
};

export default Welcome;
