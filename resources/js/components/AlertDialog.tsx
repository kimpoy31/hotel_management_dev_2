import React, { ReactNode, useEffect, useRef, useState } from "react";

interface Props {
    modalTitle?: string;
    modalDescription?: string;
    buttonTitle: string;
    buttonIcon?: ReactNode;
    buttonClassname?: string;
    children?: ReactNode;
    confirmAction?: () => void;
    cancelAction?: () => void;
    confirmButtonClassname?: string;
    confirmButtonDisabled?: boolean;
    cancelButtonName?: string;
}

const AlertDialog = ({
    modalTitle,
    buttonTitle,
    buttonClassname,
    buttonIcon,
    modalDescription,
    children,
    confirmAction,
    confirmButtonClassname,
    confirmButtonDisabled,
    cancelButtonName,
    cancelAction,
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
                {buttonIcon}
                {buttonTitle}
            </button>

            <dialog ref={dialogRef} className="modal">
                <div className="modal-box max-w-sm">
                    {modalTitle && (
                        <h3 className="font-bold text-lg">{modalTitle}</h3>
                    )}
                    {modalDescription && (
                        <p className="py-4">{modalDescription}</p>
                    )}
                    <div className="my-2">{children}</div>
                    <div className="modal-action gap-1 md:flex-row flex-col-reverse">
                        <button
                            className="btn"
                            onClick={() => {
                                cancelAction?.();
                                setOpen(false);
                            }}
                            type="button"
                        >
                            {cancelButtonName ?? "Close"}
                        </button>
                        <button
                            className={`btn btn-accent ${confirmButtonClassname}`}
                            onClick={() => {
                                confirmAction?.();
                                setOpen(false);
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
