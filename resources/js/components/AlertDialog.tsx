import React, { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
    modalTitle?: string;
    modalDescription?: string;
    buttonTitle: string;
    buttonClassname?: string;
    children?: ReactNode;
}

const AlertDialog = ({
    modalTitle,
    buttonTitle,
    buttonClassname,
    modalDescription,
    children,
}: Props) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (dialogRef.current) {
            if (open) {
                dialogRef.current.showModal();
            } else {
                dialogRef.current.close();
            }
        }
    }, [open]);

    return (
        <>
            <button
                className={`btn ${buttonClassname}`}
                onClick={() => setOpen(true)}
                type="button"
            >
                {buttonTitle}
            </button>

            <dialog ref={dialogRef} className="modal ">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">{modalTitle}</h3>
                    <p className="py-4">{modalDescription}</p>
                    {children}
                    <div className="modal-action">
                        <button
                            className="btn"
                            onClick={() => setOpen(false)}
                            type="button"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default AlertDialog;
