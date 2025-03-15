import { AdditionItem, InventoryItem, ItemType } from "@/types";
import React, { useEffect } from "react";

interface Props {
    inventoryItems: InventoryItem[];
    roomAdditions: AdditionItem[];
    setRoomAdditions: React.Dispatch<React.SetStateAction<AdditionItem[]>>;
}

const SetRoomAdditions = ({
    inventoryItems,
    roomAdditions,
    setRoomAdditions,
}: Props) => {
    // Handle adding of room inclusions
    const handleRoomInclusionChange = (
        item_id: number,
        action: "increment" | "decrement",
        type: ItemType,
        price: number,
        name: string
    ) => {
        setRoomAdditions((prevRoomAdditions: AdditionItem[]) => {
            let updatedAdditions = prevRoomAdditions.map((item) =>
                item.item_id === item_id
                    ? {
                          ...item,
                          quantity:
                              action === "increment"
                                  ? item.quantity + 1
                                  : item.quantity - 1,
                      }
                    : item
            ) as AdditionItem[];

            // Filter out items with quantity 0
            updatedAdditions = updatedAdditions.filter(
                (item) => item.quantity > 0
            );

            // Check if the item was not in the previous state and add it
            const itemExists = prevRoomAdditions.some(
                (item) => item.item_id === item_id
            );

            if (!itemExists && action === "increment") {
                updatedAdditions.push({
                    item_id,
                    quantity: 1,
                    type,
                    price,
                    name,
                });
            }

            return updatedAdditions; // Returns updated array of AdditionItem[]
        });
    };

    return (
        <fieldset className="fieldset">
            <legend className="fieldset-legend">Room additions</legend>
            <div className="overflow-x-auto overflow-y-auto max-h-64">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Quantity</th>
                            <th>Item</th>
                            <th>Item type</th>
                            <th>Available stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryItems.map((inventoryItem, index) => {
                            let itemQuantity =
                                roomAdditions.find(
                                    (roomAddition) =>
                                        roomAddition.item_id ===
                                        inventoryItem.id
                                )?.quantity ?? 0;

                            return (
                                <tr key={index}>
                                    <td>
                                        <div className="flex items-center ">
                                            <button
                                                className="btn btn-success btn-xs btn-square"
                                                onClick={() =>
                                                    handleRoomInclusionChange(
                                                        inventoryItem.id,
                                                        "decrement",
                                                        inventoryItem.item_type,
                                                        inventoryItem.price,
                                                        inventoryItem.item_name
                                                    )
                                                }
                                                disabled={itemQuantity === 0}
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
                                                        inventoryItem.id,
                                                        "increment",
                                                        inventoryItem.item_type,
                                                        inventoryItem.price,
                                                        inventoryItem.item_name
                                                    )
                                                }
                                                disabled={
                                                    inventoryItem.available ===
                                                    itemQuantity
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td>{inventoryItem.item_name}</td>
                                    <td>{inventoryItem.item_type}</td>
                                    <td>{inventoryItem.available}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </fieldset>
    );
};

export default SetRoomAdditions;
