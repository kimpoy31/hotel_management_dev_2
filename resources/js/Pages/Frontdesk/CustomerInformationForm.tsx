import FormHeader from "@/components/FormHeader";
import React from "react";
import CameraCapture from "./CameraCapture";
import { X } from "lucide-react";
import ErrorMessage from "@/components/ErrorMessage";
import { Transaction } from "@/types";
import DisplayEmpty from "@/components/DisplayEmpty";

interface Props {
    customerName: string;
    setCustomerName: (value: string) => void;
    customerAddress: string;
    setCustomerAddress: (value: string) => void;
    customerContactNumber: string;
    setCustomerContactNumber: (value: string) => void;
    customerIDPicture: File | null;
    setCustomerIDpicture: (value: File | null) => void;
    errors?: Record<string, string | string[]>;
    room_transaction: Transaction | null;
}

const CustomerInformationForm = ({
    customerName,
    setCustomerName,
    customerAddress,
    setCustomerAddress,
    customerContactNumber,
    setCustomerContactNumber,
    customerIDPicture,
    setCustomerIDpicture,
    room_transaction,
    errors,
}: Props) => {
    return (
        <div>
            <FormHeader className="text-start">Customer Information</FormHeader>
            <div className="flex lg:flex-row flex-col gap-4">
                <div className="block w-full">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Fullname</legend>
                        <input
                            type="text"
                            className="input input-lg w-full capitalize"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            disabled={!!room_transaction}
                        />
                        {errors?.customer_name && (
                            <ErrorMessage>{errors.customer_name}</ErrorMessage>
                        )}
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Address</legend>
                        <input
                            type="text"
                            className="input input-lg w-full"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                            disabled={!!room_transaction}
                        />
                        {errors?.customer_address && (
                            <ErrorMessage>
                                {errors.customer_address}
                            </ErrorMessage>
                        )}
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">
                            Contact number
                        </legend>
                        <input
                            type="text"
                            className="input input-lg w-full"
                            value={customerContactNumber}
                            onChange={(e) =>
                                setCustomerContactNumber(e.target.value)
                            }
                            disabled={!!room_transaction}
                        />
                        {errors?.customer_contact_number && (
                            <ErrorMessage>
                                {errors.customer_contact_number}
                            </ErrorMessage>
                        )}
                    </fieldset>
                </div>
                <div className="w-full">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">ID picture</legend>
                    </fieldset>
                    {room_transaction?.id_picture_path ? (
                        <img
                            src={`/storage/${room_transaction?.id_picture_path}`}
                            alt="Landscape"
                            className="w-full max-w-sm rounded-lg shadow-md"
                        />
                    ) : customerIDPicture ? (
                        <div className="flex gap-1">
                            <button
                                className="btn btn-square btn-sm btn-error"
                                onClick={() => setCustomerIDpicture(null)}
                            >
                                <X />
                            </button>
                            {customerIDPicture && (
                                <div>
                                    <img
                                        src={URL.createObjectURL(
                                            customerIDPicture
                                        )}
                                        alt="Uploaded file"
                                        className="w-full max-w-sm rounded-lg shadow-md"
                                    />
                                </div>
                            )}
                        </div>
                    ) : room_transaction ? (
                        <DisplayEmpty />
                    ) : (
                        <CameraCapture
                            customerIDPicture={customerIDPicture}
                            setCustomerIDpicture={setCustomerIDpicture}
                        />
                    )}
                    {errors?.id_picture && (
                        <ErrorMessage>{errors.id_picture}</ErrorMessage>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerInformationForm;
