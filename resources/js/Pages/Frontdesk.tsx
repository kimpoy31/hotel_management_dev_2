import DisplayEmpty from "@/components/DisplayEmpty";
import FormHeader from "@/components/FormHeader";
import RoomCard from "@/components/RoomCard";
import { Reservation, Room } from "@/types";
import { Link } from "@inertiajs/react";
import React from "react";

interface Props {
    rooms: Room[];
    reservations: Reservation[];
}

const Frontdesk = ({ rooms, reservations }: Props) => {
    return (
        <div className="flex w-full flex-col items-center">
            <div className="w-full lg:max-w-10/12">
                {/* ROOMS FOR CHECK IN | CHECK OUT */}
                <FormHeader className="text-start lg:my-2 mb-1">
                    Rooms
                </FormHeader>
                <div className="flex gap-2 justify-center flex-wrap items-center sm:flex-row flex-col bg-base-200 lg:p-4 py-2 px-0">
                    {rooms.map((room, index) => (
                        <RoomCard
                            navigateOnClick={true}
                            room={room}
                            key={index}
                        />
                    ))}
                </div>
            </div>

            <div className="w-full lg:max-w-10/12">
                {/* ROOM RESERVATIONS */}
                <FormHeader className="text-start lg:my-2 mb-1 flex gap-4 items-center ">
                    Reservations
                    <Link
                        href={route("frontdesk.room.reserve.form")}
                        className="btn btn-sm btn-accent"
                    >
                        Add reservation
                    </Link>
                </FormHeader>
                <div className="lg:p-4 p-2 bg-base-200 flex sm:flex-row flex-col gap-2">
                    {reservations.length > 0 ? (
                        reservations.map((reservation, index) => (
                            <Link
                                href={route(
                                    "frontdesk.room.reserve.form",
                                    reservation.id
                                )}
                                key={index}
                                className="bg-secondary cursor-pointer hover:brightness-110 hover:shadow-xl p-2 flex gap-1 w-full sm:max-w-56 rounded-xl"
                            >
                                <div className="bg-base-100 h-20 w-16 rounded-lg justify-center flex items-center text-xl font-bold">
                                    {
                                        rooms.find(
                                            (room) =>
                                                room.id ===
                                                reservation.reserved_room_id
                                        )?.room_number
                                    }
                                </div>
                                <div className="flex flex-col text-sm">
                                    <div className="font-bold">
                                        {new Date(
                                            reservation.check_in_datetime
                                        ).toDateString()}{" "}
                                        {new Date(
                                            reservation.check_in_datetime
                                        ).toLocaleTimeString()}
                                    </div>
                                    <div className="divider my-0"></div>
                                    <div className="font-bold italic">
                                        Check-in date & time
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <DisplayEmpty borderColor="border-zinc-700" />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Frontdesk;
