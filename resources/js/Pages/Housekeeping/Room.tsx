import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import { ItemToCheck, Room as RoomType } from "@/types";
import { usePage } from "@inertiajs/react";
import React from "react";
import RoomHeader from "../Frontdesk/RoomHeader";
import FormHeader from "@/components/FormHeader";

interface Props {
    room: RoomType;
    items_to_check: ItemToCheck[];
}

const Room = ({ room, items_to_check }: Props) => {
    // const user roles
    const userRoles = usePage().props.auth.user.roles;

    return (
        <div className="flex justify-center">
            <Card className="lg:card-md card-xs">
                <BackButton
                    routeName={
                        userRoles.includes("administrator")
                            ? "housekeeping"
                            : "dashboard"
                    }
                />
                <RoomHeader room={room} />
                <div className="divider m-0"></div>
                <FormHeader className="text-start">Items to check</FormHeader>
                <div className="overflow-x-auto overflow-y-auto max-h-64 p-4 bg-base-200 rounded-xl">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Quantity checked</th>
                                <th>Quantity to check</th>
                                <th>Item</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items_to_check.map((item, index) => (
                                <tr key={index}>
                                    <td>buttons</td>
                                    <td>{item.quantity_to_check}</td>
                                    <td>{item.item_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Room;
