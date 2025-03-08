import React, { ReactNode } from "react";

const ErrorMessage = ({ children }: { children: ReactNode }) => {
    return <div className="text-error">{children}</div>;
};

export default ErrorMessage;
