import RoomCard from "@/components/RoomCard";
import { Room } from "@/types";
import React from "react";

interface Props {
    rooms: Room[];
}

const Frontdesk = ({ rooms }: Props) => {
    return (
        <div>
            <div className="flex gap-2 justify-center flex-wrap items-center sm:flex-row flex-col">
                {rooms.map((room, index) => (
                    <RoomCard room={room} key={index} />
                ))}
            </div>
        </div>
    );
};

export default Frontdesk;
