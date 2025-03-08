import React, { ReactNode } from "react";

const Card = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={`card flex-none w-full max-w-7xl bg-base-100 card-md shadow-sm ${className}`}
        >
            <div className="card-body">{children}</div>
        </div>
    );
};

export default Card;
