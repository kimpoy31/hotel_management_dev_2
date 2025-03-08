import Card from "@/components/Card";
import { InventoryItem, Rate, User } from "@/types";
import { Link } from "@inertiajs/react";
import React from "react";
import EmployeeTable from "./Admin/EmployeeTable";
import InventoryTable from "./Admin/InventoryTable";
import RateTable from "./Admin/RateTable";

interface Props {
    employees: User[];
    inventory_items: InventoryItem[];
    rates: Rate[];
}

const Admin = ({ employees, inventory_items, rates }: Props) => {
    return (
        <div className="w-full flex items-center flex-col gap-4 lg:py-2">
            <Card>
                <div className="flex justify-between">
                    <h2 className="card-title">Employee manager</h2>
                    <Link
                        href={route("employee.form")}
                        className="btn btn-sm btn-accent"
                    >
                        Add employee
                    </Link>
                </div>
                <EmployeeTable employees={employees} />
            </Card>
            <Card>
                <div className="flex justify-between">
                    <h2 className="card-title">Inventory</h2>
                    <Link
                        href={route("inventory.form")}
                        className="btn btn-sm btn-accent"
                    >
                        Add Item
                    </Link>
                </div>
                <InventoryTable inventoryItems={inventory_items ?? []} />
            </Card>
            <Card>
                <div className="flex justify-between">
                    <h2 className="card-title">Room Rate(s)</h2>
                    <Link
                        href={route("rate.form")}
                        className="btn btn-sm btn-accent"
                    >
                        Add Item
                    </Link>
                </div>
                <RateTable rates={rates ?? []} />
            </Card>
        </div>
    );
};

export default Admin;
