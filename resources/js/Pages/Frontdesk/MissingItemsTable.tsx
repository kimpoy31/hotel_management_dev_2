import DisplayEmpty from "@/components/DisplayEmpty";
import FormHeader from "@/components/FormHeader";
import { ItemToCheck } from "@/types";
import React from "react";

interface Props {
    missingItems: ItemToCheck[];
}

const MissingItemsTable = ({ missingItems }: Props) => {
    return (
        <>
            <FormHeader className="bg-base-100!">Missing Items</FormHeader>
            {missingItems.length > 0 ? (
                <div className="overflow-x-auto overflow-y-auto max-h-64 p-4 bg-base-100 rounded-xl">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Missing</th>
                                <th>Item</th>
                            </tr>
                        </thead>
                        <tbody>
                            {missingItems.map((missingItem, index) => (
                                <tr key={index}>
                                    <td className="font-bold text-error text-lg">
                                        {missingItem.quantity_to_check -
                                            missingItem.quantity_checked}
                                    </td>
                                    <td>{missingItem.item_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <DisplayEmpty />
            )}
        </>
    );
};

export default MissingItemsTable;
