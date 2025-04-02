import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import CountdownTimer from "@/components/CountdownTimer";
import FormHeader from "@/components/FormHeader";
import { AdditionItem, InventoryItem, Rate, Reservation, Room } from "@/types";
import React, { useEffect, useState } from "react";
import SetRoomAdditions from "./SetRoomAdditions";
import AlertDialog from "@/components/AlertDialog";
import { formatTransactionDuration } from "./CheckInForm";
import { router } from "@inertiajs/react";
import { getExpectedCheckoutDatetime } from "./Room";

interface Props {
    rooms: Room[];
    inventory_items: InventoryItem[];
    rates: Rate[];
    reservation?: Reservation | null;
}

const RoomReservationForm = ({
    rooms,
    inventory_items,
    rates,
    reservation,
}: Props) => {
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(
        reservation?.reserved_room_id ?? null
    );
    const [roomAdditions, setRoomAdditions] = useState<AdditionItem[]>(
        reservation?.room_additions ?? []
    );
    const [roomRateAvailedId, setRoomRateAvailedId] = useState(
        reservation?.rate_availed_id ?? 0
    );
    const [numberOfDays, setNumberOfDays] = useState(
        reservation?.number_of_days ?? 1
    );
    const [guestName, setGuestName] = useState(reservation?.guest_name ?? "");
    const [guestAddress, setGuestAddress] = useState(
        reservation?.guest_address ?? ""
    );
    const [guestContactNumber, setGuestContactNumber] = useState(
        reservation?.guest_contact_number ?? ""
    );
    const [reservationDateTime, setReservationDateTime] = useState<string>(
        reservation?.check_in_datetime ?? ""
    );

    const [isFullPayment, setIsFullPayment] = useState<boolean | null>(
        reservation?.pending_payment === null
            ? null
            : reservation?.pending_payment === 0
            ? true
            : false
    );

    let selectedRate = rates.find((rate) => rate.id === roomRateAvailedId);
    let selectedRoom = rooms.find((room) => room.id === selectedRoomId);
    let filteredRates = rates.filter((rate) =>
        selectedRoom?.room_rate_ids.includes(rate.id)
    );
    let roomAdditionsTotalPayment = roomAdditions.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const resetReservationDates = () => {
        setReservationDateTime("");
        setNumberOfDays(1);
    };

    const handleSubmit = async () => {
        await router.post(route("reserve.room"), {
            reservation_id: reservation?.id ?? null,
            reserved_room_id: selectedRoomId,
            room_additions: JSON.stringify(roomAdditions),
            rate_availed_id: roomRateAvailedId,
            check_in_datetime: reservationDateTime,
            expected_check_out: getExpectedCheckoutDatetime(
                reservationDateTime,
                (selectedRate?.duration ?? 0) *
                    (numberOfDays < 1 ? 1 : numberOfDays)
            ),
            number_of_hours:
                (selectedRate?.duration ?? 0) *
                (numberOfDays < 1 ? 1 : numberOfDays),
            number_of_days: numberOfDays < 1 ? 1 : numberOfDays,
            guest_name: guestName,
            guest_address: guestAddress,
            guest_contact_number: guestContactNumber,
            total_payment: isFullPayment
                ? (selectedRate?.rate ?? 0) *
                      (numberOfDays < 1 ? 1 : numberOfDays) +
                  roomAdditionsTotalPayment
                : (selectedRate?.rate ?? 0) *
                      (numberOfDays < 1 ? 1 : numberOfDays) *
                      0.5 +
                  roomAdditionsTotalPayment,
            pending_payment: !isFullPayment
                ? (selectedRate?.rate ?? 0) *
                  (numberOfDays < 1 ? 1 : numberOfDays) *
                  0.5
                : 0,
        });
    };

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
                                    ? setSelectedRoomId(null)
                                    : setSelectedRoomId(room.id);
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
                            Room Additions
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
                                        value={guestName}
                                        onChange={(e) =>
                                            setGuestName(e.target.value)
                                        }
                                    />
                                </fieldset>
                                <fieldset className="fieldset w-full max-w-sm">
                                    <legend className="fieldset-legend">
                                        Address
                                    </legend>
                                    <input
                                        type="text"
                                        className="input input-lg capitalize w-full "
                                        value={guestAddress}
                                        onChange={(e) =>
                                            setGuestAddress(e.target.value)
                                        }
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
                                    value={guestContactNumber}
                                    onChange={(e) =>
                                        setGuestContactNumber(e.target.value)
                                    }
                                />
                            </fieldset>
                        </div>

                        {/* RESERVE RATE AND DURATION */}
                        <div className="bg-base-300 border-4 border-base-100 border-dashed p-4 pb-6 mt-8 ">
                            <div className="flex flex-wrap">
                                <fieldset className="fieldset w-full max-w-sm">
                                    <legend className="fieldset-legend">
                                        Reservation duration & rate
                                    </legend>
                                    <select
                                        value={roomRateAvailedId}
                                        className="select select-lg"
                                        onChange={(e) => {
                                            resetReservationDates();
                                            setRoomRateAvailedId(
                                                Number(e.target.value)
                                            );
                                        }}
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
                        {selectedRate && (
                            <div className="bg-base-300 border-4 border-base-100 border-dashed p-4 pb-6 mt-8 ">
                                <div className="flex flex-wrap">
                                    <fieldset className="fieldset w-full max-w-sm">
                                        <legend className="fieldset-legend">
                                            Reservation date & time
                                        </legend>
                                        {selectedRate.duration < 24 ? (
                                            <input
                                                type="datetime-local"
                                                className="input input-lg"
                                                value={
                                                    reservationDateTime
                                                        ? reservationDateTime
                                                              .replace(" ", "T")
                                                              .slice(0, 16)
                                                        : ""
                                                }
                                                onChange={(e) =>
                                                    setReservationDateTime(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            <input
                                                type="date"
                                                className="input input-lg"
                                                value={
                                                    reservationDateTime
                                                        ? reservationDateTime.split(
                                                              "T"
                                                          )[0]
                                                        : ""
                                                } // Extract only YYYY-MM-DD
                                                onChange={(e) =>
                                                    setReservationDateTime(
                                                        e.target.value +
                                                            "T14:00:00.000Z"
                                                    )
                                                }
                                            />
                                        )}
                                    </fieldset>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {roomRateAvailedId > 0 && reservationDateTime && (
                    <div className="mt-8 gap-2 flex sm:flex-row flex-col bg-base-300 p-4 border-4 border-dashed border-base-100">
                        <div
                            className={`w-full bg-secondary text-secondary-content p-8 rounded-xl shadow-xl cursor-pointer hover:brightness-110 flex flex-col ${
                                isFullPayment === false &&
                                "border-4 border-success"
                            }`}
                            onClick={() => {
                                isFullPayment === null
                                    ? setIsFullPayment(false)
                                    : isFullPayment === true
                                    ? setIsFullPayment(false)
                                    : setIsFullPayment(null);
                            }}
                        >
                            <div className="text-2xl font-bold">
                                ₱
                                {parseFloat(
                                    (
                                        (selectedRate?.rate ?? 0) *
                                        (numberOfDays < 1 ? 1 : numberOfDays) *
                                        0.5
                                    ).toFixed(2)
                                ) + roomAdditionsTotalPayment}
                            </div>
                            <div className="italic">50% Downpayment</div>
                        </div>
                        <div
                            className={`w-full bg-secondary text-secondary-content p-8 rounded-xl shadow-xl cursor-pointer hover:brightness-110 flex flex-col ${
                                isFullPayment === true &&
                                "border-4 border-success"
                            }`}
                            onClick={() => {
                                isFullPayment === null
                                    ? setIsFullPayment(true)
                                    : isFullPayment === false
                                    ? setIsFullPayment(true)
                                    : setIsFullPayment(null);
                            }}
                        >
                            <div className="text-2xl font-bold">
                                ₱
                                {(selectedRate?.rate ?? 0) *
                                    (numberOfDays < 1 ? 1 : numberOfDays) +
                                    roomAdditionsTotalPayment}
                            </div>
                            <div className="italic">Full payment</div>
                        </div>
                    </div>
                )}

                <div className="divider"></div>
                <AlertDialog
                    buttonTitle="Submit reservation"
                    buttonClassname="btn btn-accent"
                    modalTitle="Reservation details"
                    modalButtonDisabled={
                        !guestName.trim() ||
                        !guestAddress.trim() ||
                        !guestContactNumber.trim() ||
                        !roomRateAvailedId ||
                        !selectedRoomId ||
                        !reservationDateTime ||
                        isFullPayment === null
                    }
                    confirmAction={() => handleSubmit()}
                >
                    <div className="overflow-x-auto overflow-y-auto max-h-64">
                        <div>
                            <div className="flex gap-2">
                                <div>Room:</div>
                                <div className="font-bold text-accent-content">
                                    {selectedRoom?.room_number}
                                </div>
                            </div>
                            {roomAdditions.length > 0 && (
                                <div className="flex gap-2">
                                    <div>Room additions:</div>
                                    <div className="font-bold text-accent-content">
                                        {roomAdditions.map(
                                            (item) =>
                                                item.name +
                                                " " +
                                                item.quantity +
                                                "pc(s), "
                                        )}
                                    </div>
                                </div>
                            )}
                            <div className="flex gap-2">
                                <div>Reservation date & time:</div>
                                <div className="font-bold text-accent-content">
                                    {new Date(
                                        reservationDateTime
                                    ).toLocaleDateString()}{" "}
                                    {new Date(
                                        reservationDateTime
                                    ).toLocaleTimeString()}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div>Stay duration:</div>
                                <div className="font-bold text-accent-content">
                                    {formatTransactionDuration(
                                        (selectedRate?.duration ?? 0) *
                                            (numberOfDays < 1
                                                ? 1
                                                : numberOfDays)
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div>Guest name:</div>
                                <div className="font-bold text-accent-content">
                                    {guestName}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div>Guest address:</div>
                                <div className="font-bold text-accent-content">
                                    {guestAddress}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div>Guest contact number:</div>
                                <div className="font-bold text-accent-content">
                                    {guestContactNumber}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div>Received payment:</div>
                                <div className="font-bold text-accent-content">
                                    {isFullPayment
                                        ? "Full amount"
                                        : "Downpayment"}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div>Payment amount:</div>
                                <div className="font-bold text-accent-content">
                                    ₱
                                    {isFullPayment
                                        ? (selectedRate?.rate ?? 0) *
                                              (numberOfDays < 1
                                                  ? 1
                                                  : numberOfDays) +
                                          roomAdditionsTotalPayment
                                        : (selectedRate?.rate ?? 0) *
                                              (numberOfDays < 1
                                                  ? 1
                                                  : numberOfDays) *
                                              0.5 +
                                          roomAdditionsTotalPayment}
                                </div>
                            </div>
                        </div>
                    </div>
                </AlertDialog>
            </Card>
        </div>
    );
};

export default RoomReservationForm;
