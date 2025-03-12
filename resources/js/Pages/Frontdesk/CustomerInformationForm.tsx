import FormHeader from "@/components/FormHeader";
import React from "react";
import CameraCapture from "./CameraCapture";
import { X } from "lucide-react";

interface Props {
    customerName: string;
    setCustomerName: (value: string) => void;
    customerAddress: string;
    setCustomerAddress: (value: string) => void;
    customerContactNumber: string;
    setCustomerContactNumber: (value: string) => void;
    customerIDPicture: File | null;
    setCustomerIDpicture: (value: File | null) => void;
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
                            className="input input-lg w-full"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                        />
                        {/* {errors.item_name && (
                            <ErrorMessage>
                                {errors.item_name.map((error) => error)}
                            </ErrorMessage>
                        )} */}
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Address</legend>
                        <input
                            type="text"
                            className="input input-lg w-full"
                            value={customerAddress}
                            onChange={(e) => setCustomerAddress(e.target.value)}
                        />
                        {/* {errors.item_name && (
                            <ErrorMessage>
                                {errors.item_name.map((error) => error)}
                            </ErrorMessage>
                        )} */}
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
                        />
                        {/* {errors.item_name && (
                            <ErrorMessage>
                                {errors.item_name.map((error) => error)}
                            </ErrorMessage>
                        )} */}
                    </fieldset>
                </div>
                <div className="w-full">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">ID picture</legend>
                    </fieldset>
                    {customerIDPicture ? (
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
                    ) : (
                        <CameraCapture
                            customerIDPicture={customerIDPicture}
                            setCustomerIDpicture={setCustomerIDpicture}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default CustomerInformationForm;
