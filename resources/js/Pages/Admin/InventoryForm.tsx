import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import { ItemType } from "@/types";
import React, { useState } from "react";

const InventoryForm = () => {
    const [itemName, setItemName] = useState("");
    const [itemType, setItemType] = useState<ItemType | "">("");
    const [itemQuantity, setItemQuantity] = useState(0);
    const [itemPrice, setItemPrice] = useState(0);

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
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Stock quantity</legend>
                    <input
                        type="number"
                        className="input input-lg"
                        value={itemQuantity}
                        onChange={(e) =>
                            setItemQuantity(parseInt(e.target.value))
                        }
                    />
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                        Item Price / Charge per use
                    </legend>
                    <input
                        type="number"
                        className="input input-lg"
                        value={itemPrice}
                        onChange={(e) =>
                            setItemPrice(parseFloat(e.target.value))
                        }
                    />
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
                >
                    Add Item
                </button>
            </Card>
        </div>
    );
};

export default InventoryForm;
