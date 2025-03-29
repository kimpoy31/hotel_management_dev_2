import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import CountdownTimer from "@/components/CountdownTimer";
import FormHeader from "@/components/FormHeader";
import { AdditionItem, InventoryItem, Rate, Room } from "@/types";
import React, { useEffect, useState } from "react";
import SetRoomAdditions from "./SetRoomAdditions";

interface Props {
    rooms: Room[];
    inventory_items: InventoryItem[];
    rates: Rate[];
}

const RoomReservationForm = ({ rooms, inventory_items, rates }: Props) => {
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [roomAdditions, setRoomAdditions] = useState<AdditionItem[]>([]);
    const [roomRateAvailedId, setRoomRateAvailedId] = useState(0);
    const [numberOfDays, setNumberOfDays] = useState(1);

    let filteredRates = rates.filter((rate) =>
        selectedRoom?.room_rate_ids.includes(rate.id)
    );

    let selectedRate = rates.find((rate) => rate.id === roomRateAvailedId);

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
                                    {room.room_type}
                                </div>
                                <div className="text-xs">
                                    {room.room_status}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ROOM ADDITIONS HERE */}
                {selectedRoom && (
                    <>
                        <FormHeader className="text-start ">
                            Additional information
                        </FormHeader>

                        <SetRoomAdditions
                            roomAdditions={roomAdditions}
                            setRoomAdditions={setRoomAdditions}
                            inventoryItems={inventory_items}
                            hideLabel={true}
                        />

                        {/* GUEST INFORMATION  */}
                        <div className="bg-base-300 border-4 border-base-100 border-dashed p-4 pb-6">
                            <legend className="fieldset-legend text-2xl uppercase">
                                Guest information
                            </legend>
                            <div className="flex sm:flex-row flex-col w-full gap-x-4">
                                <fieldset className="fieldset w-full max-w-sm">
                                    <legend className="fieldset-legend">
                                        Fullname
                                    </legend>
                                    <input
                                        type="text"
                                        className="input input-lg capitalize w-full"
                                    />
                                </fieldset>
                                <fieldset className="fieldset w-full max-w-sm">
                                    <legend className="fieldset-legend">
                                        Address
                                    </legend>
                                    <input
                                        type="text"
                                        className="input input-lg capitalize w-full "
                                    />
                                </fieldset>
                            </div>
                            <fieldset className="fieldset w-full max-w-sm">
                                <legend className="fieldset-legend">
                                    Contact number
                                </legend>
                                <input
                                    type="text"
                                    className="input input-lg capitalize w-full"
                                />
                            </fieldset>
                        </div>

                        {/* RESERVE DATE AND TIME */}
                        <div className="bg-base-300 border-4 border-base-100 border-dashed p-4 pb-6 mt-8 ">
                            <div className="flex flex-wrap">
                                <fieldset className="fieldset w-full max-w-sm">
                                    <legend className="fieldset-legend">
                                        Reservation duration & rate
                                    </legend>
                                    <select
                                        value={roomRateAvailedId}
                                        className="select select-lg"
                                        onChange={(e) =>
                                            setRoomRateAvailedId(
                                                Number(e.target.value)
                                            )
                                        }
                                    >
                                        <option disabled={true} value={0}>
                                            Please select
                                        </option>
                                        {filteredRates.map((rate, index) => (
                                            <option key={index} value={rate.id}>
                                                {rate.duration >= 24
                                                    ? "Daily rate - ₱" +
                                                      rate.rate
                                                    : rate.duration +
                                                      "Hours - ₱" +
                                                      rate.rate}
                                            </option>
                                        ))}
                                    </select>
                                </fieldset>
                                {selectedRate &&
                                    selectedRate?.duration >= 24 && (
                                        <fieldset className="fieldset w-full max-w-sm">
                                            <legend className="fieldset-legend">
                                                Number of days
                                            </legend>
                                            <input
                                                type="number"
                                                className="input input-lg max-w-32"
                                                value={
                                                    !isNaN(numberOfDays!) &&
                                                    numberOfDays &&
                                                    numberOfDays > 0
                                                        ? numberOfDays
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    setNumberOfDays?.(
                                                        Math.floor(
                                                            Number(
                                                                e.target.value
                                                            )
                                                        )
                                                    )
                                                }
                                            />
                                        </fieldset>
                                    )}
                            </div>
                        </div>

                        {/* RESERVE DATE AND TIME */}
                        <div className="bg-base-300 border-4 border-base-100 border-dashed p-4 pb-6 mt-8 ">
                            <div className="flex flex-wrap">
                                <fieldset className="fieldset w-full max-w-sm">
                                    <legend className="fieldset-legend">
                                        Reservation date & time
                                    </legend>
                                    <input
                                        type="datetime-local"
                                        className="input input-lg"
                                    />
                                </fieldset>
                            </div>
                        </div>
                    </>
                )}

                <div className="divider"></div>
                <button className="btn btn-accent">Submit reservation</button>
            </Card>
        </div>
    );
};

export default RoomReservationForm;
