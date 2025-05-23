import FormHeader from "@/components/FormHeader";
import { useApi } from "@/context/ApiProvider";
import React from "react";

const InProcessItemsTable = () => {
    const { inventoryItems } = useApi();
    return (
        <div>
            <FormHeader className="bg-secondary! text-start">
                Processing
            </FormHeader>
            <div className="overflow-x-auto overflow-y-auto max-h-64 p-4 bg-base-100 rounded-xl">
                <table className="table ">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th className="text-center">Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {inventoryItems.map((item, index) => (
                            <tr key={index}>
                                <td>{item.item_name}</td>
                                <td className="text-center">
                                    {item.in_process ?? 0}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InProcessItemsTable;
