import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import { Rate } from "@/types";
import React, { useState } from "react";

interface Props {
    errors: Record<string, string[]>;
    rates: Rate[];
}

const RoomForm = ({ rates }: Props) => {
    const [roomNumber, setRoomNumber] = useState("");
    const [roomType, setRoomType] = useState("");
    const [roomRates, setRoomRates] = useState<number[]>([]);

    const handleRatesOffered = (rateId: number) => {
        let newRoomRates = roomRates;

        if (newRoomRates.includes(rateId)) {
            setRoomRates(newRoomRates.filter((rateId) => rateId !== rateId));
        } else {
            setRoomRates([...newRoomRates, rateId]);
        }
    };

    return (
        <div className="flex flex-col gap-2">
            <BackButton routeName="admin" />
            <Card>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Room number</legend>
                    <input
                        type="number"
                        className="input input-lg"
                        value={roomNumber}
                        onChange={(e) => setRoomNumber(e.target.value)}
                    />
                    {/* {errors.rate && (
                        <ErrorMessage>{errors.rate.map((error) => error)}</ErrorMessage>
                    )} */}
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Room type</legend>
                    <input
                        type="number"
                        className="input input-lg"
                        value={roomType}
                        onChange={(e) => setRoomType(e.target.value)}
                    />
                    {/* {errors.rate && (
                        <ErrorMessage>{errors.rate.map((error) => error)}</ErrorMessage>
                    )} */}
                </fieldset>
                <div className="divider"></div>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                        Room rate(s) offered
                    </legend>
                    <div className="overflow-x-auto overflow-y-auto max-h-64">
                        <table className="table ">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Duration</th>
                                    <th>Rate / Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rates.map((rate, index) => (
                                    <tr key={index}>
                                        <th className="capitalize">
                                            <label className="fieldset-label">
                                                <input
                                                    type="checkbox"
                                                    onChange={() =>
                                                        handleRatesOffered(
                                                            rate.id
                                                        )
                                                    }
                                                    checked={roomRates.includes(
                                                        rate.id
                                                    )}
                                                    className="checkbox checkbox-neutral checkbox-lg bg-neutral"
                                                />
                                                Offer this rate
                                            </label>
                                        </th>
                                        <td>{rate.duration} Hour(s) </td>
                                        <td>₱{rate.rate}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* {errors.rate && (
                        <ErrorMessage>{errors.rate.map((error) => error)}</ErrorMessage>
                    )} */}
                </fieldset>
                <div className="divider"></div>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                        Room inclusion(s)
                    </legend>
                    <input
                        type="number"
                        className="input input-lg"
                        // value={rate > 0 ? rate : ""}
                        // onChange={(e) => setRate(parseFloat(e.target.value))}
                    />
                    {/* {errors.rate && (
                        <ErrorMessage>{errors.rate.map((error) => error)}</ErrorMessage>
                    )} */}
                </fieldset>
            </Card>
        </div>
    );
};

export default RoomForm;
