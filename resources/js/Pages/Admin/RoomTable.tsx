import { Room } from "@/types";
import { Link } from "@inertiajs/react";

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
                                <div className="flex flex-col">
                                    {room.room_rates.map((rate, index) => (
                                        <span key={index}>
                                            {rate.duration +
                                                " Hour(s) - ₱" +
                                                rate.rate}
                                        </span>
                                    ))}
                                </div>
                            </td>
                            <td>
                                {room.room_inclusion_items.length > 0 ? (
                                    room.room_inclusion_items
                                        .map((item) => {
                                            const inclusions = Array.isArray(
                                                room.room_inclusions
                                            )
                                                ? room.room_inclusions
                                                : [];
                                            const quantity = inclusions.find(
                                                (inclusion) =>
                                                    inclusion.item_id ===
                                                    item.id
                                            )?.quantity;

                                            return `${item.item_name} ${
                                                quantity || 0
                                            } pc(s)`;
                                        })
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
