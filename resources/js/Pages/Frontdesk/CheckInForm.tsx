import FormHeader from "@/components/FormHeader";
import { Rate, Transaction } from "@/types";
import { useEffect, useState } from "react";

interface Props {
    rates: Rate[];
    roomRateId: number;
    setRoomRateId: (value: number) => void;
    numberOfDays: number | undefined;
    setNumberOfDays: (value: number) => void;
    active_transaction: Transaction | null;
}

const CheckInForm = ({
    rates,
    roomRateId,
    setRoomRateId,
    numberOfDays,
    setNumberOfDays,
    active_transaction,
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
                {active_transaction ? (
                    <div className="bg-base-200 w-full rounded text-lg">
                        <div className="overflow-x-auto overflow-y-auto max-h-64">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="uppercase">
                                            Check-in details
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="w-fit">
                                            <div className="flex gap-2 text-nowrap">
                                                Check-in:
                                                <span className="font-bold text-accent-content text-nowrap">
                                                    {new Date(
                                                        active_transaction?.check_in
                                                    ).toDateString()}{" "}
                                                    {new Date(
                                                        active_transaction?.check_in
                                                    ).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="w-fit">
                                            <div className="flex gap-2 text-nowrap">
                                                Expected checkout:
                                                <span className="font-bold text-accent-content text-nowrap">
                                                    {new Date(
                                                        active_transaction?.expected_check_out
                                                    ).toDateString()}{" "}
                                                    {new Date(
                                                        active_transaction?.expected_check_out
                                                    ).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div className="flex gap-2">
                                                Stay duration:
                                                <span className="font-bold text-accent-content">
                                                    {Math.floor(
                                                        active_transaction?.number_of_hours /
                                                            24
                                                    ) != 0 &&
                                                        (Math.floor(
                                                            active_transaction?.number_of_hours /
                                                                24
                                                        ) > 1
                                                            ? Math.floor(
                                                                  active_transaction?.number_of_hours /
                                                                      24
                                                              ) + " Days & "
                                                            : Math.floor(
                                                                  active_transaction?.number_of_hours /
                                                                      24
                                                              ) + " Day & ")}

                                                    {active_transaction?.number_of_hours %
                                                        24 >
                                                        0 &&
                                                    active_transaction?.number_of_hours %
                                                        24 >
                                                        1
                                                        ? (active_transaction?.number_of_hours %
                                                              24) +
                                                          " Hours"
                                                        : (active_transaction?.number_of_hours %
                                                              24) +
                                                          " Hour"}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <fieldset className="fieldset w-full max-w-xs">
                        <legend className="fieldset-legend">
                            Room rate / duration
                        </legend>
                        <select
                            defaultValue={roomRateId}
                            className="select select-lg w-full"
                            onChange={(e) =>
                                setRoomRateId(Number(e.target.value))
                            }
                        >
                            <option disabled={true} value={0}>
                                Select room rate
                            </option>
                            {rates.map((rate, index) => (
                                <option key={index} value={rate.id}>
                                    {rate.duration >= 24
                                        ? "Daily rate - ₱" + rate.rate
                                        : rate.duration +
                                          "Hours - ₱" +
                                          rate.rate}
                                </option>
                            ))}
                        </select>
                    </fieldset>
                )}
                {selectedRate &&
                    selectedRate.duration >= 24 &&
                    !active_transaction && (
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
