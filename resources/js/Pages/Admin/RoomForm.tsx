import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import { InclusionItem, InventoryItem, ItemType, Rate } from "@/types";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

interface Props {
    errors: Record<string, string[]>;
    rates: Rate[];
    inventory_items: InventoryItem[];
}

const RoomForm = ({ rates, inventory_items }: Props) => {
    const [roomNumber, setRoomNumber] = useState("");
    const [roomType, setRoomType] = useState("");
    const [roomRates, setRoomRates] = useState<number[]>([]);
    const [roomInclusions, setRoomInclusions] = useState<InclusionItem[]>([]);

    const handleRatesOffered = (rateId: number) => {
        let newRoomRates = roomRates;

        if (newRoomRates.includes(rateId)) {
            setRoomRates(newRoomRates.filter((rateId) => rateId !== rateId));
        } else {
            setRoomRates([...newRoomRates, rateId]);
        }
    };

    // Handle adding of room inclusions
    const handleRoomInclusionChange = (
        item_id: number,
        action: "increment" | "decrement",
        type: ItemType
    ) => {
        setRoomInclusions((prevRoomInclusions) => {
            let updatedInclusions = prevRoomInclusions.map((item) =>
                item.item_id === item_id
                    ? {
                          ...item,
                          quantity:
                              action === "increment"
                                  ? item.quantity + 1
                                  : item.quantity - 1,
                      }
                    : item
            );

            // Filter out items with quantity 0
            updatedInclusions = updatedInclusions.filter(
                (item) => item.quantity > 0
            );

            // Check if the item was not in the previous state and add it
            const itemExists = prevRoomInclusions.some(
                (item) => item.item_id === item_id
            );

            if (!itemExists && action === "increment") {
                updatedInclusions.push({ item_id, quantity: 1, type });
            }

            return updatedInclusions;
        });
    };

    const handleRoomSubmit = async () => {
        await router.post(route(""));
    };

    return (
        <div className="flex flex-col gap-2">
            <BackButton routeName="admin" />
            <Card>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Room number</legend>
                    <input
                        type="text"
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
                        type="text"
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
                    <div className="overflow-x-auto overflow-y-auto max-h-64">
                        <table className="table ">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Item</th>
                                    <th>Stock</th>
                                    <th>Item type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inventory_items.map((item, index) => {
                                    let itemQuantity =
                                        roomInclusions.find(
                                            (inclusionItem) =>
                                                inclusionItem.item_id ===
                                                item.id
                                        )?.quantity ?? 0;

                                    return (
                                        <tr key={index}>
                                            <th className="capitalize">
                                                <div className="flex items-center ">
                                                    <button
                                                        className="btn btn-success btn-xs btn-square"
                                                        onClick={() =>
                                                            handleRoomInclusionChange(
                                                                item.id,
                                                                "decrement",
                                                                item.item_type
                                                            )
                                                        }
                                                        disabled={
                                                            itemQuantity === 0
                                                        }
                                                    >
                                                        -
                                                    </button>
                                                    <span className="w-8 text-center">
                                                        {itemQuantity}
                                                    </span>
                                                    <button
                                                        className="btn btn-success btn-xs btn-square"
                                                        onClick={() =>
                                                            handleRoomInclusionChange(
                                                                item.id,
                                                                "increment",
                                                                item.item_type
                                                            )
                                                        }
                                                        disabled={
                                                            item.available +
                                                                (item.in_use ??
                                                                    0) +
                                                                (item.in_process ??
                                                                    0) ===
                                                            itemQuantity
                                                        }
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </th>
                                            <td className="capitalize">
                                                {item.item_name}
                                            </td>
                                            <td className="capitalize">
                                                {item.available +
                                                    (item.in_process ?? 0) +
                                                    (item.in_use ?? 0)}
                                            </td>
                                            <td className="capitalize">
                                                {item.item_type}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* {errors.rate && (
                        <ErrorMessage>{errors.rate.map((error) => error)}</ErrorMessage>
                    )} */}
                </fieldset>
                <div className="divider"></div>
                <button
                    className="btn btn-accent"
                    disabled={!roomNumber || roomRates.length <= 0 || !roomType}
                >
                    Add room
                </button>
            </Card>
        </div>
    );
};

export default RoomForm;
