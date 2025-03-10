import React, { ReactNode } from "react";

const FormHeader = ({ children }: { children: ReactNode }) => {
    return (
        <div className="text-center bg-base-200 py-2 shadow uppercase font-bold">
            {children}
        </div>
    );
};

export default FormHeader;
