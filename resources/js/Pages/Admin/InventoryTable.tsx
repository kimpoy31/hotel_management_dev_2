import { InventoryItem } from "@/types";
import { Link } from "@inertiajs/react";
import React from "react";

const InventoryTable = ({
    inventoryItems,
}: {
    inventoryItems: InventoryItem[];
}) => {
    return (
        <div className="overflow-x-auto overflow-y-auto max-h-64 ">
            <table className="table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Type</th>
                        <th>Stock</th>
                        <th>Available</th>
                        <th>Price / Charge</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {inventoryItems.map((item, index) => (
                        <tr key={index}>
                            <th className="capitalize">{item.item_name}</th>
                            <td>{item.item_type}</td>
                            <td>
                                {item.available +
                                    (item.in_process ?? 0) +
                                    (item.in_use ?? 0) +
                                    (item.sold ?? 0)}
                            </td>
                            <td>{item.available}</td>
                            <td> ₱{item.price}</td>
                            <td>
                                <Link
                                    href={route("inventory.form", item.id)}
                                    className="btn btn-xs btn-primary"
                                >
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;
