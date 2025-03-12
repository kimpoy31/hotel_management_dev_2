import FormHeader from "@/components/FormHeader";
import React from "react";
import CameraCapture from "./CameraCapture";

interface Props {
    customerName: string;
    setCustomerName: (value: string) => void;
    customerAddress: string;
    setCustomerAddress: (value: string) => void;
    customerContactNumber: string;
    setCustomerContactNumber: (value: string) => void;
}

const CustomerInformationForm = ({
    customerName,
    setCustomerName,
    customerAddress,
    setCustomerAddress,
    customerContactNumber,
    setCustomerContactNumber,
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
                    {/* <CameraCapture /> */}
                </div>
            </div>
        </div>
    );
};

export default CustomerInformationForm;
