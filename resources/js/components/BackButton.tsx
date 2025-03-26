import { Link } from "@inertiajs/react";
import { MoveLeft } from "lucide-react";
import React from "react";

const BackButton = ({ routeName }: { routeName: string }) => {
    return (
        <Link href={route(routeName)} className="btn btn-dash w-full">
            <MoveLeft /> Go back
        </Link>
    );
};

export default BackButton;
