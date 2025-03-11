import { getBgColor, getTextColor } from "@/components/RoomCard";
import { Room } from "@/types";
import React from "react";

const RoomHeader = ({ room }: { room: Room }) => {
    return (
        <div className="mt-3 rounded-lg text-center">
            <div
                className={`font-bold text-center uppercase py-1 rounded-lg mb-2 text-lg ${getBgColor(
                    room
                )} ${getTextColor(room)}`}
            >
                {room.room_status}
            </div>
            <div
                className={`text-center bg-base-200 py-4 flex flex-col rounded-lg ${getBgColor(
                    room
                )} ${getTextColor(room)}`}
            >
                <span className="uppercase sm:text-6xl text-4xl font-bold">
                    {room.room_number}
                </span>
                <span className="uppercase text-sm ">Room</span>
            </div>
            <div className="text-lg uppercase mt-2">{room.room_type}</div>
        </div>
    );
};

export default RoomHeader;
