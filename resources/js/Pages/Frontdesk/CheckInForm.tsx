import AlertDialog from "@/components/AlertDialog";
import FormHeader from "@/components/FormHeader";
import { Rate, Transaction } from "@/types";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { getCheckoutDateTime } from "./Room";

interface Props {
    rates: Rate[];
    roomRateId: number;
    stayExtension: number;
    setRoomRateId: (value: number) => void;
    setStayExtension: (value: number) => void;
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
    setStayExtension,
    stayExtension,
}: Props) => {
    const [selectedRate, setSelectedRate] = useState<Rate | null>(() =>
        active_transaction
            ? rates.find((rate) => rate.id === stayExtension) ?? null
            : rates.find((rate) => rate.id === roomRateId) ?? null
    );

    const formatTransactionDuration = (numberOfHours?: number) => {
        if (!numberOfHours) return "";

        const days = Math.floor(numberOfHours / 24);
        const hours = numberOfHours % 24;

        if (days > 0 && hours > 0) {
            return `${days} ${days > 1 ? "Days" : "Day"} & ${hours} ${
                hours > 1 ? "Hours" : "Hour"
            }`;
        }

        if (days > 0) {
            return `${days} ${days > 1 ? "Days" : "Day"}`;
        }

        if (hours > 0) {
            return `${hours} ${hours > 1 ? "Hours" : "Hour"}`;
        }

        return "";
    };

    useEffect(() => {
        setSelectedRate(
            active_transaction
                ? rates.find((rate) => rate.id === stayExtension) ?? null
                : rates.find((rate) => rate.id === roomRateId) ?? null
        );
    }, [roomRateId, stayExtension]);

    return (
        <div>
            <FormHeader className="text-start">Room Information</FormHeader>
            <div className="flex flex-col gap-2">
                {active_transaction && (
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
                                                    {formatTransactionDuration(
                                                        active_transaction.number_of_hours
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="flex gap-2">
                    <fieldset className="fieldset w-full max-w-xs">
                        <legend className="fieldset-legend">
                            Room rate / duration
                        </legend>
                        <select
                            value={
                                active_transaction ? stayExtension : roomRateId
                            }
                            className="select select-lg w-full"
                            onChange={(e) => {
                                active_transaction
                                    ? setStayExtension(Number(e.target.value))
                                    : setRoomRateId(Number(e.target.value));
                            }}
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
                                    setNumberOfDays?.(
                                        Math.floor(Number(e.target.value))
                                    )
                                }
                            />
                        </fieldset>
                    )}
                </div>

                <div className="flex gap-1">
                    {active_transaction && stayExtension > 0 && (
                        <button
                            className="btn btn-error btn-square"
                            onClick={() => {
                                setStayExtension(0);
                                setNumberOfDays(0);
                            }}
                        >
                            <X />
                        </button>
                    )}
                    {active_transaction && (
                        <AlertDialog
                            buttonTitle="Extend duration"
                            buttonClassname="btn btn-success w-fit"
                            modalButtonDisabled={!stayExtension}
                            modalTitle="Extend duration"
                            modalDescription={`Are you sure you want to extend the customer's stay duration for Room Number ${active_transaction?.room_number}?`}
                        >
                            <div className="overflow-x-auto overflow-y-auto max-h-72">
                                <table className="table table-sm">
                                    <thead>
                                        <tr>
                                            <th className="uppercase">
                                                Updated Details {numberOfDays}
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="w-fit">
                                                <div className="flex flex-col gap-2 text-nowrap">
                                                    <div>Check-in:</div>
                                                    <div className="font-bold text-accent-content text-nowrap">
                                                        {new Date(
                                                            active_transaction!.check_in
                                                        ).toDateString()}{" "}
                                                        {new Date(
                                                            active_transaction!.check_in
                                                        ).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td className="w-fit">
                                                <div className="flex flex-col gap-2 text-nowrap">
                                                    <div>
                                                        Updated expected
                                                        checkout:
                                                    </div>

                                                    <div className="font-bold text-accent-content text-nowrap">
                                                        {getCheckoutDateTime(
                                                            active_transaction.check_in,
                                                            active_transaction.number_of_hours +
                                                                (selectedRate?.duration ??
                                                                    0)
                                                        ).toDateString()}{" "}
                                                        {getCheckoutDateTime(
                                                            active_transaction.check_in,
                                                            active_transaction.number_of_hours +
                                                                (selectedRate?.duration ??
                                                                    0)
                                                        ).toLocaleTimeString()}
                                                    </div>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr>
                                            <td>
                                                <div className="flex gap-2">
                                                    Updated stay duration:
                                                    <span className="font-bold text-accent-content">
                                                        {selectedRate?.duration &&
                                                            formatTransactionDuration(
                                                                selectedRate.duration <
                                                                    24
                                                                    ? active_transaction.number_of_hours +
                                                                          selectedRate.duration
                                                                    : active_transaction.number_of_hours +
                                                                          selectedRate.duration *
                                                                              (numberOfDays
                                                                                  ? Math.max(
                                                                                        numberOfDays,
                                                                                        1
                                                                                    )
                                                                                  : 1)
                                                            )}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>

                                        <tr className="w-fit">
                                            <td className="flex gap-2 text-nowrap">
                                                Extended by:
                                                <span className="font-bold text-success text-nowrap">
                                                    {selectedRate?.duration &&
                                                        formatTransactionDuration(
                                                            selectedRate.duration <
                                                                24
                                                                ? selectedRate.duration
                                                                : selectedRate.duration *
                                                                      (numberOfDays
                                                                          ? Math.max(
                                                                                numberOfDays,
                                                                                1
                                                                            )
                                                                          : 1)
                                                        )}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className="divider m-0"></div>
                                <div className="flex justify-between">
                                    <div> Please collect total amount:</div>
                                    <div className="font-bold text-lg">
                                        ₱
                                        {selectedRate?.duration &&
                                        selectedRate?.duration < 24
                                            ? selectedRate?.rate
                                            : selectedRate?.rate &&
                                              selectedRate?.rate *
                                                  (numberOfDays &&
                                                  numberOfDays > 0
                                                      ? numberOfDays
                                                      : 1)}
                                    </div>
                                </div>
                            </div>
                        </AlertDialog>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckInForm;
