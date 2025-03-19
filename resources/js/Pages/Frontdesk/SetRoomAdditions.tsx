import AlertDialog from "@/components/AlertDialog";
import { AdditionItem, InventoryItem, ItemType, Transaction } from "@/types";
import { router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

interface Props {
    inventoryItems: InventoryItem[];
    roomAdditions: AdditionItem[];
    newRoomAdditions: AdditionItem[];
    setRoomAdditions: React.Dispatch<React.SetStateAction<AdditionItem[]>>;
    setNewRoomAdditions: React.Dispatch<React.SetStateAction<AdditionItem[]>>;
    active_transaction: Transaction | null;
    room_id: number;
}

const SetRoomAdditions = ({
    inventoryItems,
    roomAdditions,
    setRoomAdditions,
    newRoomAdditions,
    setNewRoomAdditions,
    active_transaction,
    room_id,
}: Props) => {
    const [isEditing, setIsEditing] = useState(false);

    // Function that updates table quantity
    const updateAdditions = (
        prevAdditions: AdditionItem[],
        item_id: number,
        action: "increment" | "decrement",
        type: ItemType,
        price: number,
        name: string
    ): AdditionItem[] => {
        let updatedAdditions = prevAdditions.map((item) =>
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
        updatedAdditions = updatedAdditions.filter((item) => item.quantity > 0);

        // Check if the item was not in the previous state and add it
        const itemExists = prevAdditions.some(
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

        return updatedAdditions;
    };

    // Handle adding of room additions
    const handleRoomInclusionChange = (
        item_id: number,
        action: "increment" | "decrement",
        type: ItemType,
        price: number,
        name: string
    ) => {
        active_transaction
            ? setNewRoomAdditions((prev) =>
                  updateAdditions(prev, item_id, action, type, price, name)
              )
            : setRoomAdditions((prev) =>
                  updateAdditions(prev, item_id, action, type, price, name)
              );
    };

    const updateRoomAdditions = async () => {
        await router.patch(route("update.room.additions", room_id), {
            new_room_additions: JSON.stringify(newRoomAdditions),
            total_payment: newRoomAdditions.reduce(
                (total, item) => total + item.price * item.quantity,
                0
            ),
        });

        // Merge newRoomAdditions into roomAdditions
        const mergedRoomAdditions = [...roomAdditions];

        newRoomAdditions.forEach((newItem) => {
            const existingItemIndex = mergedRoomAdditions.findIndex(
                (item) => item.item_id === newItem.item_id
            );

            if (existingItemIndex !== -1) {
                // If item exists, increase the quantity
                mergedRoomAdditions[existingItemIndex].quantity +=
                    newItem.quantity;
            } else {
                // If item does not exist, add as new item
                mergedRoomAdditions.push(newItem);
            }
        });

        setRoomAdditions(mergedRoomAdditions);
    };

    return (
        <fieldset className="fieldset">
            <div className="flex flex-col gap-2">
                <legend className="fieldset-legend">Room additions</legend>
                {active_transaction && (
                    <div className="flex gap-1">
                        <button
                            className={`btn btn-accent btn-xs ${
                                isEditing && "btn-error"
                            }`}
                            onClick={() => {
                                setIsEditing(!isEditing);
                                setNewRoomAdditions([]);
                            }}
                        >
                            {isEditing ? "Cancel" : "Edit"}
                        </button>
                        {isEditing && newRoomAdditions.length > 0 && (
                            <AlertDialog
                                confirmAction={async () => {
                                    await updateRoomAdditions();
                                    setNewRoomAdditions([]);
                                    setIsEditing(false);
                                }}
                                buttonTitle="Save"
                                buttonClassname="btn btn-success btn-xs"
                                cancelButtonName="Edit"
                                modalTitle="Room additions"
                                modalDescription="Please collect the total amount. NOTE: No refund policy applies after payment."
                            >
                                <div className="overflow-x-auto overflow-y-auto max-h-64">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Item</th>
                                                <th>Quantity</th>
                                                <th>Price</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {newRoomAdditions.map(
                                                (item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.name}</td>
                                                        <td>{item.quantity}</td>
                                                        <td>
                                                            ₱
                                                            {item.price *
                                                                item.quantity}
                                                        </td>
                                                    </tr>
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                                <div className="divider m-0"></div>
                                <div className="flex justify-between mb-4 px-2">
                                    <div>Total Amount</div>
                                    <div className="font-bold text-lg">
                                        ₱
                                        {newRoomAdditions.reduce(
                                            (total, item) =>
                                                total +
                                                item.price * item.quantity,
                                            0
                                        )}
                                    </div>
                                </div>
                            </AlertDialog>
                        )}
                    </div>
                )}
            </div>
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
                                (roomAdditions.find(
                                    (roomAddition) =>
                                        roomAddition.item_id ===
                                        inventoryItem.id
                                )?.quantity ?? 0) +
                                (newRoomAdditions.find(
                                    (roomAddition) =>
                                        roomAddition.item_id ===
                                        inventoryItem.id
                                )?.quantity ?? 0);

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
                                                disabled={
                                                    itemQuantity === 0 ||
                                                    (active_transaction
                                                        ? roomAdditions.find(
                                                              (roomAddition) =>
                                                                  roomAddition.item_id ===
                                                                  inventoryItem.id
                                                          )?.quantity ===
                                                          itemQuantity
                                                        : false) ||
                                                    (active_transaction &&
                                                    !isEditing
                                                        ? true
                                                        : false)
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
                                                        inventoryItem.id,
                                                        "increment",
                                                        inventoryItem.item_type,
                                                        inventoryItem.price,
                                                        inventoryItem.item_name
                                                    )
                                                }
                                                disabled={
                                                    inventoryItem.available ===
                                                        itemQuantity ||
                                                    (active_transaction &&
                                                    !isEditing
                                                        ? true
                                                        : false)
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
