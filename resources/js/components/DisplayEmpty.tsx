import React from "react";

const DisplayEmpty = ({
    className,
    borderColor,
}: {
    className?: string;
    borderColor?: string;
}) => {
    return (
        <div
            className={`${className} text-center w-full py-2 border-2 border-dashed ${
                borderColor ?? "border-neutral"
            }`}
        >
            Empty
        </div>
    );
};

export default DisplayEmpty;
