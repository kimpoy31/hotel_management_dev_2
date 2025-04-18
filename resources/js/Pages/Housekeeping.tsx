import DisplayEmpty from "@/components/DisplayEmpty";
import FormHeader from "@/components/FormHeader";
import RoomCard from "@/components/RoomCard";
import { useApi } from "@/context/ApiProvider";
import React from "react";

const Housekeeping = () => {
    const roomsForInspection = useApi().rooms.filter(
        (room) => room.room_status === "pending_inspection"
    );
    const roomsForCleaning = useApi().rooms.filter(
        (room) => room.room_status === "cleaning"
    );

    return (
        <div className="flex w-full flex-col items-center">
            <div className="w-full lg:max-w-10/12">
                {/* ROOMS FOR CHECK IN | CHECK OUT */}
                <FormHeader className="text-start lg:my-2 mb-1">
                    For Inspection
                </FormHeader>

                <div className="flex gap-2 justify-center flex-wrap items-center sm:flex-row flex-col bg-base-200 lg:p-4 py-2 px-0">
                    {roomsForInspection.length > 0 ? (
                        roomsForInspection.map((room, index) => (
                            <RoomCard
                                navigateOnClick={true}
                                room={room}
                                key={index}
                                route={route("housekeeping.room.form", room.id)}
                            />
                        ))
                    ) : (
                        <DisplayEmpty />
                    )}
                </div>

                <FormHeader className="text-start lg:my-2 mb-1">
                    For Cleaning
                </FormHeader>

                <div className="flex gap-2 justify-center flex-wrap items-center sm:flex-row flex-col bg-base-200 lg:p-4 py-2 px-0">
                    {roomsForCleaning.length > 0 ? (
                        roomsForCleaning.map((room, index) => (
                            <RoomCard
                                navigateOnClick={true}
                                room={room}
                                key={index}
                                route={route("housekeeping.room.form", room.id)}
                            />
                        ))
                    ) : (
                        <DisplayEmpty />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Housekeeping;
