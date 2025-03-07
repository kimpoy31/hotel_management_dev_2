import React, { ReactNode } from "react";

const Card = ({ children }: { children: ReactNode }) => {
    return (
        <div className="card flex-none w-full max-w-7xl bg-base-100 card-md shadow-sm">
            <div className="card-body">{children}</div>
        </div>
    );
};

export default Card;
