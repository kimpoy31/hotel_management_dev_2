import { Room } from "@/types";
import { Link } from "@inertiajs/react";
import React from "react";

const RoomTable = ({ rooms }: { rooms: Room[] }) => {
    return (
        <div className="overflow-x-auto overflow-y-auto max-h-64 ">
            <table className="table">
                <thead>
                    <tr>
                        <th>Room number</th>
                        <th>Room rates</th>
                        <th>Room inclusions</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {rooms.map((room, index) => (
                        <tr key={index}>
                            <th className="capitalize">{room.room_number}</th>
                            <td>
                                {room.room_rates.map(
                                    (rate) =>
                                        rate.duration +
                                        " Hour(s) - ₱" +
                                        rate.rate
                                )}
                            </td>
                            <td>
                                {room.room_inclusion_items.length > 0 ? (
                                    room.room_inclusion_items
                                        .map(
                                            (item) =>
                                                item.item_name +
                                                " " +
                                                room.room_inclusions?.find(
                                                    (inclusion) =>
                                                        inclusion.item_id ===
                                                        item.id
                                                )?.quantity +
                                                "pc(s)"
                                        )
                                        .join(", ")
                                ) : (
                                    <span className="text-xs text-secondary italic">
                                        No room inclusions
                                    </span>
                                )}
                            </td>

                            <td>
                                <Link
                                    href={route("room.form", room.id)}
                                    className="btn btn-xs btn-primary"
                                >
                                    Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoomTable;
