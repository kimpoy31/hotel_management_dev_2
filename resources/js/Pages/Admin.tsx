import Card from "@/components/Card";
import { InventoryItem, Rate, User } from "@/types";
import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";
import EmployeeTable from "./Admin/EmployeeTable";
import InventoryTable from "./Admin/InventoryTable";
import RateTable from "./Admin/RateTable";

interface Props {
    employees: User[];
    inventory_items: InventoryItem[];
    rates: Rate[];
    overtime_charge: number;
}

const Admin = ({
    employees,
    inventory_items,
    rates,
    overtime_charge,
}: Props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [overtimeCharge, setOvertimeCharge] = useState(overtime_charge ?? 0);

    const handleGeneralSettingSubmit = async () => {
        if (isEditing) {
            await router.patch(route("overtime_charge.patch"), {
                overtime_charge:
                    !isNaN(overtimeCharge) && overtimeCharge > 0
                        ? overtimeCharge
                        : 0,
            });
        }
    };

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
            <Card className="max-w-lg self-start">
                <div className="flex justify-between ">
                    <h2 className="card-title">General settings</h2>
                    <button
                        className="btn btn-sm btn-accent"
                        onClick={async () => {
                            await handleGeneralSettingSubmit();
                            setIsEditing(!isEditing);
                        }}
                    >
                        {isEditing ? "Save" : "Edit"}
                    </button>
                </div>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                        Overtime charge (per hour)
                    </legend>
                    <input
                        type="number"
                        className="input input-lg"
                        value={overtimeCharge > 0 ? overtimeCharge : ""}
                        disabled={!isEditing}
                        onChange={(e) =>
                            setOvertimeCharge(parseFloat(e.target.value))
                        }
                    />
                </fieldset>
            </Card>
        </div>
    );
};

export default Admin;
