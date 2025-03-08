import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import ErrorMessage from "@/components/ErrorMessage";
import { InventoryItem, ItemType } from "@/types";
import { router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

interface Props {
    errors: Record<string, string[]>;
    inventory_item?: InventoryItem;
}

const InventoryForm = ({ errors, inventory_item }: Props) => {
    const [itemName, setItemName] = useState(inventory_item?.item_name ?? "");
    const [itemType, setItemType] = useState<ItemType | "">(
        inventory_item?.item_type ?? ""
    );
    const [itemQuantity, setItemQuantity] = useState(
        inventory_item?.available ?? 0
    );
    const [itemPrice, setItemPrice] = useState(inventory_item?.price ?? 0);

    const handleSubmit = async () => {
        await router.post(route("inventory.form.submit", inventory_item?.id), {
            item_name: itemName,
            item_type: itemType,
            available: itemQuantity,
            price: itemPrice,
        });
    };

    return (
        <div className="flex flex-col gap-2">
            <BackButton routeName="admin" />
            <Card>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Item name</legend>
                    <input
                        type="text"
                        className="input input-lg"
                        value={itemName}
                        onChange={(e) => setItemName(e.target.value)}
                    />
                    {errors.item_name && (
                        <ErrorMessage>
                            {errors.item_name.map((error) => error)}
                        </ErrorMessage>
                    )}
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Item type</legend>
                    <select
                        className="select select-lg"
                        value={itemType}
                        onChange={(e) =>
                            setItemType(e.target.value as ItemType)
                        }
                    >
                        <option disabled value={""}>
                            Please select item type
                        </option>
                        <option value="room amenity">Room amenity</option>
                        <option value="consumable">Consumable</option>
                    </select>
                    {errors.item_type && (
                        <ErrorMessage>
                            {errors.item_type.map((error) => error)}
                        </ErrorMessage>
                    )}
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Stock quantity</legend>
                    <input
                        type="number"
                        className="input input-lg"
                        value={itemQuantity > 0 ? itemQuantity : ""}
                        onChange={(e) =>
                            setItemQuantity(parseInt(e.target.value))
                        }
                    />
                    {errors.available && (
                        <ErrorMessage>
                            {errors.available.map((error) => error)}
                        </ErrorMessage>
                    )}
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                        Item Price / Charge per use
                    </legend>
                    <input
                        type="number"
                        className="input input-lg"
                        value={itemPrice > 0 ? itemPrice : ""}
                        onChange={(e) =>
                            setItemPrice(parseFloat(e.target.value))
                        }
                    />
                    {errors.price && (
                        <ErrorMessage>
                            {errors.price.map((error) => error)}
                        </ErrorMessage>
                    )}
                </fieldset>
                <div className="divider"></div>
                <button
                    className="btn btn-accent"
                    disabled={
                        !itemName ||
                        !itemType ||
                        itemQuantity < 1 ||
                        itemPrice < 1 ||
                        isNaN(itemQuantity) ||
                        isNaN(itemPrice)
                    }
                    onClick={() => handleSubmit()}
                >
                    {inventory_item ? "Update item" : "Add item"}
                </button>
            </Card>
        </div>
    );
};

export default InventoryForm;
