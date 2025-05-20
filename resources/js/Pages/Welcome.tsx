import React from "react";
import Frontdesk from "./Frontdesk";
import { usePage } from "@inertiajs/react";
import Housekeeping from "./Housekeeping";
import Card from "@/components/Card";
import FormHeader from "@/components/FormHeader";
import { useApi } from "@/context/ApiProvider";

const Welcome = () => {
    const userRole = usePage().props.auth.user.roles;
    const { inventoryItems } = useApi();

    return (
        <Card className="lg:card-md card-xs">
            <FormHeader className="text-xl">Inventory</FormHeader>
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
                                <tr>
                                    <td key={index}>{item.item_name}</td>
                                    <td key={index} className="text-center">
                                        {item.available}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-center">
                <div className="flex justify-center sm:flex-row flex-col gap-4 bg-base-200 p-4 w-full max-w-7xl">
                    <div>
                        <FormHeader className="bg-secondary!">
                            Processing
                        </FormHeader>
                        <div className="overflow-x-auto overflow-y-auto max-h-64 p-4 bg-base-100 rounded-xl">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th className="text-center">
                                            Quantity
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventoryItems.map((item, index) => (
                                        <tr>
                                            <td key={index}>
                                                {item.item_name}
                                            </td>
                                            <td
                                                key={index}
                                                className="text-center"
                                            >
                                                {item.in_process ?? 0}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <FormHeader className="bg-secondary!">
                            Missing
                        </FormHeader>
                        <div className=" overflow-x-auto overflow-y-auto max-h-64 p-4 bg-base-100 rounded-xl">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th className="text-center">
                                            Quantity
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventoryItems.map((item, index) => (
                                        <tr>
                                            <td key={index}>
                                                {item.item_name}
                                            </td>
                                            <td
                                                key={index}
                                                className="text-center text-error"
                                            >
                                                {item.missing ?? 0}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div>
                        <FormHeader className="text-accent-content shadow-none mb-0.5">
                            Total Stock
                        </FormHeader>
                        <div className="overflow-x-auto overflow-y-auto max-h-64 p-4 bg-base-100 rounded-xl">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Item</th>
                                        <th className="text-center">
                                            Total Stock
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inventoryItems.map((item, index) => (
                                        <tr>
                                            <td key={index}>
                                                {item.item_name}
                                            </td>
                                            <td
                                                key={index}
                                                className="text-center"
                                            >
                                                {item.available +
                                                    (item?.in_process ?? 0) +
                                                    (item?.in_use ?? 0) +
                                                    (item?.sold ?? 0)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {userRole.includes("frontdesk") &&
                !userRole.includes("administrator") && <Frontdesk />}
            {userRole.includes("housekeeper") &&
                !userRole.includes("administrator") && <Housekeeping />}
        </Card>
    );
};

export default Welcome;
