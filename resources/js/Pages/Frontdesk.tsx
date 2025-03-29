import DisplayEmpty from "@/components/DisplayEmpty";
import FormHeader from "@/components/FormHeader";
import RoomCard from "@/components/RoomCard";
import { Room } from "@/types";
import React from "react";

interface Props {
    rooms: Room[];
}

const Frontdesk = ({ rooms }: Props) => {
    return (
        <div>
            <FormHeader className="text-start lg:my-2 mb-1">
                Reservations
            </FormHeader>
            <DisplayEmpty borderColor="border-zinc-700" />
            <FormHeader className="text-start lg:my-2 mb-1">Rooms</FormHeader>
            <div className="flex gap-2 justify-center flex-wrap items-center sm:flex-row flex-col bg-base-200 lg:p-4 py-2 px-0">
                {rooms.map((room, index) => (
                    <RoomCard navigateOnClick={true} room={room} key={index} />
                ))}
            </div>
        </div>
    );
};

export default Frontdesk;
