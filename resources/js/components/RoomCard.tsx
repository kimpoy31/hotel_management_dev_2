import { Room } from "@/types";
import { Link } from "@inertiajs/react";
import React, { useEffect } from "react";
import CountdownTimer from "./CountdownTimer";

interface Props {
    navigateOnClick: boolean;
    className?: string;
    room: Room;
}

export const getBgColor = (room: Room) => {
    let bgColor = "";

    if (room.room_status === "available") {
        bgColor = "bg-emerald-800";
    } else if (room.room_status === "occupied") {
        bgColor = "bg-secondary";
    }

    return bgColor;
};

export const getTextColor = (room: Room) => {
    let textColor = "";

    if (room.room_status === "available") {
        textColor = "text-emerald-100";
    } else if (room.room_status === "occupied") {
        textColor = "text-secondary-content";
    }

    return textColor;
};

const RoomCard = ({ className, room, navigateOnClick }: Props) => {
    useEffect(() => {
        console.log("Active Transaction", room.active_transaction_object);
    }, []);

    return (
        <Link
            href={navigateOnClick ? route("frontdesk.room.form", room.id) : ""}
            className={`${className} gap-2 flex sm:flex-col flex-row p-2 rounded bg-base-100 w-full sm:max-w-72 cursor-pointer hover:brightness-110 shadow hover:shadow-lg`}
        >
            <div
                className={`sm:block hidden font-bold text-center uppercase py-1 rounded-lg ${getBgColor(
                    room
                )} ${getTextColor(room)}`}
            >
                {room.room_status}
            </div>
            <div
                className={`text-center bg-base-200 sm:py-10 p-4 flex flex-col rounded-lg ${getBgColor(
                    room
                )} ${getTextColor(room)}`}
            >
                <span className="uppercase sm:text-6xl text-4xl font-bold">
                    {room.room_number}
                </span>
                <span className="uppercase text-sm ">Room</span>
            </div>
            <div className={`font-bold sm:text-center uppercase w-full`}>
                <div
                    className={`sm:hidden text-start font-bold sm:text-center uppercase py-1 px-2 sm:rounded-lg rounded w-full mb-2 ${getBgColor(
                        room
                    )} ${getTextColor(room)}`}
                >
                    {room.room_status}
                </div>
                {room.room_type}
            </div>
            <CountdownTimer
                expected_check_out={
                    room.active_transaction_object?.expected_check_out ?? ""
                }
                overtime_penalty={
                    room.active_transaction_object?.overtime_charge ?? 0
                }
                roomStatus={room.room_status}
            />
        </Link>
    );
};

export default RoomCard;
