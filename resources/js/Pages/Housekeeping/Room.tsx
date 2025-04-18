import { Room as RoomType } from "@/types";
import React from "react";

interface Props {
    room: RoomType;
}

const Room = ({ room }: Props) => {
    return <div>HousekeepingRoom {room.room_number}</div>;
};

export default Room;
