import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import React from "react";

const InventoryForm = () => {
    return (
        <div className="flex flex-col gap-2">
            <BackButton routeName="admin" />
            <Card>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Item name</legend>
                    <input
                        type="text"
                        className="input input-lg"
                        // value={fullname}
                        // onChange={(e) => setFullname(e.target.value)}
                    />
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Item type</legend>
                    <select className="select select-lg">
                        <option disabled selected>
                            Select item type
                        </option>
                        <option>Room amenity</option>
                        <option>Consumable</option>
                    </select>
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Stock quantity</legend>
                    <input
                        type="number"
                        className="input input-lg"
                        // value={fullname}
                        // onChange={(e) => setFullname(e.target.value)}
                    />
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                        Item Price / Charge per use
                    </legend>
                    <input
                        type="number"
                        className="input input-lg"
                        // value={fullname}
                        // onChange={(e) => setFullname(e.target.value)}
                    />
                </fieldset>
                <div className="divider"></div>
                <button className="btn btn-accent">Add Item</button>
            </Card>
        </div>
    );
};

export default InventoryForm;
