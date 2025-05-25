import FormHeader from "@/components/FormHeader";
import { useApi } from "@/context/ApiProvider";
import { InventoryItem } from "@/types";
import { router } from "@inertiajs/react";
import React, { useState, useEffect } from "react";

const AvailableItemsTable = () => {
    const { inventoryItems } = useApi();
    const [restockId, setRestockId] = useState(0);
    const [items, setItems] = useState<InventoryItem[]>([]);

    // Sync initial state from inventoryItems once it's loaded
    useEffect(() => {
        if (inventoryItems) {
            setItems(inventoryItems);
        }
    }, [inventoryItems]);

    const handleIncrement = (itemId: number) => {
        const originalItem = inventoryItems.find((item) => item.id === itemId);

        const maxAllowed =
            (originalItem?.available ?? 0) + (originalItem?.in_process ?? 0);

        const newItems = items.map((item) => {
            if (item.id === itemId) {
                if (item.available < maxAllowed) {
                    return {
                        ...item,
                        available: item.available + 1,
                    };
                }
            }
            return item;
        });

        setItems(newItems);
    };

    const handleDecrement = (itemId: number) => {
        const inventoryItem = inventoryItems.find(
            (invItem) => invItem.id === itemId
        );

        if (!inventoryItem) return;

        const newItems = items.map((item) => {
            if (
                item.id === itemId &&
                item.available > inventoryItem.available
            ) {
                return {
                    ...item,
                    available: item.available - 1,
                };
            }
            return item;
        });

        setItems(newItems);
    };

    const saveRestockedItems = async (itemId: number, newAvailable: number) => {
        const originalItem = inventoryItems.find((item) => item.id === itemId);
        if (!originalItem) return;

        const increment = newAvailable - originalItem.available;

        // Only send positive increment or handle decrement accordingly
        if (increment !== 0) {
            await router.patch(
                route("housekeeping.restock", { itemId, quantity: increment })
            );
        }
    };

    return (
        <div>
            <FormHeader className="bg-secondary! text-start">
                Available
            </FormHeader>
            <div className="p-4 bg-base-300 rounded-xl border-4 border-base-100 border-dashed">
                <div className="overflow-x-auto overflow-y-auto max-h-64 p-4 rounded-xl">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Available</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => {
                                const originalItem = inventoryItems.find(
                                    (thisItem) => thisItem.id === item.id
                                );
                                const itemQuantity =
                                    originalItem?.available ?? 0;

                                return (
                                    <tr key={index}>
                                        <td>{item.item_name}</td>
                                        <td className="text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <button
                                                    className="btn btn-xs btn-success font-black"
                                                    disabled={
                                                        restockId !== item.id ||
                                                        item.available <=
                                                            (originalItem?.available ??
                                                                0)
                                                    }
                                                    onClick={() =>
                                                        handleDecrement(item.id)
                                                    }
                                                >
                                                    -
                                                </button>

                                                <div className="w-8 text-center">
                                                    {item.available}
                                                </div>
                                                <button
                                                    className="btn btn-xs btn-success font-black"
                                                    disabled={
                                                        restockId !== item.id ||
                                                        item.available >=
                                                            (inventoryItems.find(
                                                                (i) =>
                                                                    i.id ===
                                                                    item.id
                                                            )?.available ?? 0) +
                                                                (inventoryItems.find(
                                                                    (i) =>
                                                                        i.id ===
                                                                        item.id
                                                                )?.in_process ??
                                                                    0)
                                                    }
                                                    onClick={() =>
                                                        handleIncrement(item.id)
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <button
                                                className={`btn text-nowrap ${
                                                    restockId !== item.id
                                                        ? "btn-accent"
                                                        : item.available ===
                                                          itemQuantity
                                                        ? "btn-error"
                                                        : "btn-success"
                                                }`}
                                                onClick={async () => {
                                                    if (
                                                        restockId === item.id &&
                                                        item.available !==
                                                            itemQuantity
                                                    ) {
                                                        await saveRestockedItems(
                                                            item.id,
                                                            item.available
                                                        );
                                                    }
                                                    setRestockId(
                                                        item.id === restockId
                                                            ? 0
                                                            : item.id
                                                    );
                                                    setItems(inventoryItems);
                                                }}
                                            >
                                                {restockId !== item.id
                                                    ? "Re-stock"
                                                    : item.available ===
                                                      itemQuantity
                                                    ? "Cancel"
                                                    : "Save"}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AvailableItemsTable;
