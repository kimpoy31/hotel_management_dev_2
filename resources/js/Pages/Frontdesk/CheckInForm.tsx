import FormHeader from "@/components/FormHeader";
import { Rate } from "@/types";
import React, { useEffect, useState } from "react";

interface Props {
    rates: Rate[];
    roomRateId: number;
    setRoomRateId: (value: number) => void;
    numberOfDays: number | undefined;
    setNumberOfDays: (value: number | undefined) => void;
}

const CheckInForm = ({
    rates,
    roomRateId,
    setRoomRateId,
    numberOfDays,
    setNumberOfDays,
}: Props) => {
    const [selectedRate, setSelectedRate] = useState<Rate | null>(
        rates.find((rate) => rate.id === roomRateId) ?? null
    );

    useEffect(() => {
        setSelectedRate(rates.find((rate) => rate.id === roomRateId) ?? null);
    }, [roomRateId]);

    return (
        <div>
            <FormHeader className="text-start">Room Information</FormHeader>
            <div className="flex lg:flex-row flex-col gap-2">
                <fieldset className="fieldset w-full max-w-xs">
                    <legend className="fieldset-legend">
                        Room rate / duration
                    </legend>
                    <select
                        defaultValue={roomRateId}
                        className="select select-lg w-full"
                        onChange={(e) => setRoomRateId(Number(e.target.value))}
                    >
                        <option disabled={true} value={0}>
                            Select room rate
                        </option>
                        {rates.map((rate, index) => (
                            <option key={index} value={rate.id}>
                                {rate.duration} Hours - ₱{rate.rate}
                            </option>
                        ))}
                    </select>
                </fieldset>
                {selectedRate && selectedRate.duration >= 24 && (
                    <fieldset className="fieldset w-full">
                        <legend className="fieldset-legend">
                            Number of days
                        </legend>
                        <input
                            type="number"
                            className="input input-lg max-w-32"
                            value={
                                !isNaN(numberOfDays!) &&
                                numberOfDays &&
                                numberOfDays > 0
                                    ? numberOfDays
                                    : ""
                            }
                            onChange={(e) =>
                                setNumberOfDays?.(Number(e.target.value))
                            }
                        />
                    </fieldset>
                )}
            </div>
        </div>
    );
};

export default CheckInForm;
