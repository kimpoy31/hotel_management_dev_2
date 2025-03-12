import React, { ReactNode } from "react";

const FormHeader = ({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) => {
    return (
        <div
            className={`text-center px-4 bg-base-200 py-2 shadow uppercase font-bold ${className}`}
        >
            {children}
        </div>
    );
};

export default FormHeader;
