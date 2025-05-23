import FormHeader from "@/components/FormHeader";
import { useApi } from "@/context/ApiProvider";
import React from "react";

const AvailableItemsTable = () => {
    const { inventoryItems } = useApi();

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
                                <th className="text-center">Available</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {inventoryItems.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.item_name}</td>
                                    <td className="text-center">
                                        {item.available}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AvailableItemsTable;
