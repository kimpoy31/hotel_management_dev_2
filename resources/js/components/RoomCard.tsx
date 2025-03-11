import { Room } from "@/types";
import React from "react";

interface Props {
    className?: string;
    room: Room;
}

const RoomCard = ({ className, room }: Props) => {
    const getBgColor = () => {
        let bgColor = "";

        if (room.room_status === "available") {
            bgColor = "bg-emerald-800";
        }

        return bgColor;
    };

    const getTextColor = () => {
        let textColor = "";

        if (room.room_status === "available") {
            textColor = "text-emerald-100";
        }

        return textColor;
    };

    return (
        <div
            className={`${className} gap-2 flex sm:flex-col flex-row p-2 rounded bg-base-100 w-full sm:max-w-72 cursor-pointer hover:brightness-110 shadow hover:shadow-lg`}
        >
            <div
                className={`sm:block hidden font-bold text-center uppercase py-1 rounded-lg ${getBgColor()} ${getTextColor()}`}
            >
                {room.room_status}
            </div>
            <div
                className={`text-center bg-base-200 sm:py-10 p-4 flex flex-col rounded-lg ${getBgColor()} ${getTextColor()}`}
            >
                <span className="uppercase sm:text-6xl text-4xl font-bold">
                    {room.room_number}
                </span>
                <span className="uppercase text-sm ">Room</span>
            </div>
            <div className={`font-bold sm:text-center uppercase w-full`}>
                <div
                    className={`sm:hidden text-start font-bold sm:text-center uppercase py-1 px-2 sm:rounded-lg rounded w-full mb-2 ${getBgColor()} ${getTextColor()}`}
                >
                    {room.room_status}
                </div>
                {room.room_type}
            </div>
        </div>
    );
};

export default RoomCard;
