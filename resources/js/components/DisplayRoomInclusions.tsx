import { InclusionItem, InventoryItem } from "@/types";
import React from "react";
import FormHeader from "./FormHeader";

const DisplayRoomInclusions = ({
    roomInclusions,
    roomInclusionItems,
    withHeader,
}: {
    roomInclusions: InclusionItem[];
    roomInclusionItems: InventoryItem[];
    withHeader: boolean;
}) => {
    return (
        <>
            <FormHeader className="text-start">Room Inclusions</FormHeader>
            <div className="overflow-x-auto overflow-y-auto max-h-64">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th className="text-center">Quantity</th>
                            <th>Item type</th>
                        </tr>
                    </thead>
                    <tbody>
                        {roomInclusionItems.map((inclusionItem, index) => (
                            <tr key={index}>
                                <th>{inclusionItem.item_name}</th>
                                <td className="text-center">
                                    {
                                        roomInclusions.find(
                                            (item) =>
                                                item.item_id ===
                                                inclusionItem.id
                                        )?.quantity
                                    }
                                </td>
                                <td>{inclusionItem.item_type}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default DisplayRoomInclusions;
