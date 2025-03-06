import React, { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
    modalTitle?: string;
    modalDescription?: string;
    buttonTitle: string;
    buttonClassname?: string;
    children?: ReactNode;
    confirmAction?: () => void;
    confirmButtonClassname?: string;
    confirmButtonDisabled?: boolean;
    closeModalOnConfirm?: boolean;
}

const AlertDialog = ({
    modalTitle,
    buttonTitle,
    buttonClassname,
    modalDescription,
    children,
    confirmAction,
    confirmButtonClassname,
    closeModalOnConfirm,
    confirmButtonDisabled,
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
                className={`cursor-pointer ${buttonClassname}`}
                onClick={() => setOpen(true)}
                type="button"
            >
                {buttonTitle}
            </button>

            <dialog ref={dialogRef} className="modal ">
                <div className="modal-box">
                    {modalTitle && (
                        <h3 className="font-bold text-lg">{modalTitle}</h3>
                    )}
                    {modalDescription && (
                        <p className="py-4">{modalDescription}</p>
                    )}
                    <div className="my-2">{children}</div>
                    <div className="modal-action">
                        <button
                            className="btn"
                            onClick={() => setOpen(false)}
                            type="button"
                        >
                            Close
                        </button>
                        <button
                            className={`btn ${confirmButtonClassname}`}
                            onClick={() => {
                                confirmAction?.();
                                closeModalOnConfirm && setOpen(false);
                            }}
                            type="button"
                            disabled={confirmButtonDisabled}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </dialog>
        </>
    );
};

export default AlertDialog;
