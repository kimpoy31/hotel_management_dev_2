import Card from "@/components/Card";
import { User } from "@/types";
import { Link } from "@inertiajs/react";
import React from "react";
import EmployeeTable from "./Admin/EmployeeTable";
import InventoryTable from "./Admin/InventoryTable";

interface Props {
    employees: User[];
}

const Admin = ({ employees }: Props) => {
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
                    <h2 className="card-title">Inventory manager</h2>
                    <Link
                        href={route("inventory.form")}
                        className="btn btn-sm btn-accent"
                    >
                        Add Item
                    </Link>
                </div>
                <InventoryTable />
            </Card>
        </div>
    );
};

export default Admin;
