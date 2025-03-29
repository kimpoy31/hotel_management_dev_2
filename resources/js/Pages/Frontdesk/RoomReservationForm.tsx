import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import CountdownTimer from "@/components/CountdownTimer";
import FormHeader from "@/components/FormHeader";
import { Room } from "@/types";
import React, { useState } from "react";
import SetRoomAdditions from "./SetRoomAdditions";

interface Props {
    rooms: Room[];
}

const RoomReservationForm = ({ rooms }: Props) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    return (
        <div className="flex justify-center">
            <Card className="lg:card-md card-xs">
                <BackButton routeName="frontdesk" />
                <div className="sm:p-12 font-bold bg-base-300 p-8 text-center uppercase sm:text-3xl text-xl mt-4">
                    Reservation form
                </div>

                {/* ROOM SELECTION HERE */}
                <FormHeader className="text-start ">
                    Select room to reserve
                </FormHeader>
                <div className="flex sm:flex-row flex-col flex-wrap gap-2 my-4">
                    {rooms.map((room, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                room.id === selectedRoom?.id
                                    ? setSelectedRoom(null)
                                    : setSelectedRoom(room);
                            }}
                            className={`rounded-xl sm:max-w-52 ${
                                room.id === selectedRoom?.id &&
                                "border-4 border-success"
                            } bg-secondary w-full cursor-pointer hover:brightness-110 hover:shadow-xl p-2 flex gap-1`}
                        >
                            <div className="bg-base-100 h-16 w-16 rounded-lg justify-center flex items-center text-xl font-bold">
                                {room.room_number}
                            </div>
                            <div className="flex flex-col py-2 w-full">
                                <div className="uppercase font-bold text-sm italic text-secondary-content">
                                    {room.room_status}
                                </div>
                                <div className="text-xs">{room.room_type}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ROOM ADDITIONS HERE */}
                {selectedRoom && (
                    <>
                        <FormHeader className="text-start ">
                            Room additions
                        </FormHeader>
                        {/* <SetRoomAdditions  /> */}
                    </>
                )}
            </Card>
        </div>
    );
};

export default RoomReservationForm;
