import Card from "@/components/Card";
import { InventoryItem, Rate, Room, User } from "@/types";
import { Link, router } from "@inertiajs/react";
import React, { useState } from "react";
import EmployeeTable from "./Admin/EmployeeTable";
import InventoryTable from "./Admin/InventoryTable";
import RateTable from "./Admin/RateTable";
import RoomTable from "./Admin/RoomTable";
import { useApi } from "@/context/ApiProvider";

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

    const { rooms, inventoryItems } = useApi();

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
                    <h2 className="card-title">Room manager</h2>
                    <Link
                        href={route("room.form")}
                        className="btn btn-sm btn-accent"
                    >
                        Add room
                    </Link>
                </div>
                <RoomTable rooms={rooms ?? []} />
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
                <InventoryTable inventoryItems={inventoryItems ?? []} />
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
            <Card>
                <h2 className="card-title">General settings</h2>
                <fieldset className="fieldset">
                    <div className="flex justify-between max-w-xs">
                        <legend className="fieldset-legend">
                            Overtime charge (per hour)
                        </legend>
                        <button
                            className={`btn btn-sm ${
                                isEditing ? "btn-success" : "btn-accent"
                            } `}
                            onClick={async () => {
                                await handleGeneralSettingSubmit();
                                setIsEditing(!isEditing);
                            }}
                        >
                            {isEditing ? "Save" : "Edit"}
                        </button>
                    </div>

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
