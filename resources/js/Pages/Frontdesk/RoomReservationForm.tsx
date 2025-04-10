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
    reservations: Reservation[];
    reservation?: Reservation | null;
    reserved_room?: Room | null;
}

export const isOverlappingReservations = (
    reservations: Reservation[],
    checkIn: string,
    checkOut: string,
    reservedRoomId: number
): boolean => {
    return reservations.some((reservation) => {
        // Check if the reservation is for the same room
        if (reservation.reserved_room_id !== reservedRoomId) return false;

        // Convert to Date objects for comparison
        const existingCheckIn = new Date(
            reservation.check_in_datetime.replace("Z", "")
        ); // Remove 'Z' for proper comparison
        const existingCheckOut = new Date(
            reservation.expected_check_out.replace("Z", "")
        ); // Remove 'Z' for proper comparison
        const newCheckIn = new Date(checkIn.replace("Z", "")); // Remove 'Z' from check-in datetime
        const newCheckOut = new Date(checkOut.replace("Z", "")); // Remove 'Z' from checkout datetime

        // Check for overlap with other reservations
        return newCheckIn < existingCheckOut && newCheckOut > existingCheckIn;
    });
};

const RoomReservationForm = ({
    rooms,
    inventory_items,
    rates,
    reservation,
    reserved_room,
    reservations,
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
    const [outStandingBalancePayment, setOutStandingBalancePayment] = useState<
        number | null
    >(null);

    const [isFullPayment, setIsFullPayment] = useState<boolean | null>(
        reservation?.pending_payment === null
            ? null
            : (reservation?.pending_payment ?? 0) > 0
            ? false
            : true
    );

    let filteredRooms = reserved_room
        ? rooms.filter(
              (room) =>
                  room.room_rate_ids.length ===
                      reserved_room.room_rate_ids.length &&
                  room.room_rate_ids.every((rateId) =>
                      reserved_room.room_rate_ids.includes(rateId)
                  )
          )
        : rooms;

    let selectedRate = rates.find((rate) => rate.id === roomRateAvailedId);
    let selectedRoom = rooms.find((room) => room.id === selectedRoomId);
    let filteredRates = rates.filter((rate) =>
        selectedRoom?.room_rate_ids.includes(rate.id)
    );
    let roomAdditionsTotalAmount = roomAdditions.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const resetReservationDates = () => {
        setReservationDateTime("");
        setNumberOfDays(1);
    };

    let expected_check_out = getExpectedCheckoutDatetime(
        reservationDateTime ? new Date(reservationDateTime) : new Date(),
        (selectedRate?.duration ?? 0) *
            (numberOfDays && numberOfDays > 0 ? numberOfDays : 1)
    );

    useEffect(() => {
        console.log(selectedRoom);
    }, [selectedRoom]);

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
                  roomAdditionsTotalAmount
                : (selectedRate?.rate ?? 0) *
                      (numberOfDays < 1 ? 1 : numberOfDays) *
                      0.5 +
                  roomAdditionsTotalAmount,
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
                    {filteredRooms.map((room, index) => (
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
                                                onChange={(e) => {
                                                    setReservationDateTime(
                                                        e.target.value +
                                                            "T14:00:00.000"
                                                    );
                                                    console.log(
                                                        e.target.value +
                                                            "T14:00:00.000"
                                                    );
                                                }}
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
                        {/* Downpayment */}
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
                                ) + roomAdditionsTotalAmount}
                            </div>
                            <div className="italic">
                                50% Downpayment :{" "}
                                <span className="text-warning">
                                    {" "}
                                    ₱
                                    {parseFloat(
                                        (
                                            (selectedRate?.rate ?? 0) *
                                            (numberOfDays < 1
                                                ? 1
                                                : numberOfDays) *
                                            0.5
                                        ).toFixed(2)
                                    )}
                                </span>
                            </div>
                            {roomAdditions.length > 0 && (
                                <div className="flex gap-1 ">
                                    +
                                    {roomAdditions.map((item, index) => (
                                        <div key={index}>
                                            {item.name}({item.quantity}x):
                                            <span className="text-warning italic">
                                                ₱{item.price * item.quantity},
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Full payment*/}
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
                                {parseFloat(
                                    (
                                        (selectedRate?.rate ?? 0) *
                                        (numberOfDays < 1 ? 1 : numberOfDays)
                                    ).toFixed(2)
                                ) + roomAdditionsTotalAmount}
                            </div>
                            <div className="italic">
                                Full payment :{" "}
                                <span className="text-warning">
                                    {" "}
                                    ₱
                                    {parseFloat(
                                        (
                                            (selectedRate?.rate ?? 0) *
                                            (numberOfDays < 1
                                                ? 1
                                                : numberOfDays)
                                        ).toFixed(2)
                                    )}
                                </span>
                            </div>
                            {roomAdditions.length > 0 && (
                                <div className="flex gap-1 ">
                                    +
                                    {roomAdditions.map((item, index) => (
                                        <div key={index}>
                                            {item.name}({item.quantity}x):
                                            <span className="text-warning italic">
                                                ₱{item.price * item.quantity},
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                <div className="divider"></div>
                {isOverlappingReservations(
                    reservations,
                    reservationDateTime ?? "", // <-- Ensure a valid string for function
                    expected_check_out?.toString() ?? "",
                    selectedRoomId ?? 0
                ) && (
                    <div className="w-full text-center p-2 border border-error rounded-lg mb-2 text-error">
                        Selected duration overlaps with currently checked-in
                        guest or other reservations on this room
                    </div>
                )}
                <AlertDialog
                    buttonTitle={
                        reservation
                            ? "Update reservation"
                            : "Submit reservation"
                    }
                    buttonClassname="btn btn-accent"
                    modalTitle="Reservation details"
                    modalButtonDisabled={
                        !guestName.trim() ||
                        !guestAddress.trim() ||
                        !guestContactNumber.trim() ||
                        !roomRateAvailedId ||
                        !selectedRoomId ||
                        !reservationDateTime || // <-- Ensures it's checked first
                        new Date(reservationDateTime) <= new Date() ||
                        isFullPayment === null ||
                        // Check if the room is currently occupied and if it overlaps with the new reservation
                        (selectedRoom?.active_transaction_object
                            ?.expected_check_out &&
                            new Date(
                                selectedRoom.active_transaction_object.expected_check_out
                            ) > new Date(reservationDateTime)) ||
                        isOverlappingReservations(
                            reservations,
                            reservationDateTime ?? "", // <-- Ensure a valid string for function
                            expected_check_out?.toString() ?? "",
                            selectedRoomId ?? 0
                        )
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
                                          roomAdditionsTotalAmount
                                        : (selectedRate?.rate ?? 0) *
                                              (numberOfDays < 1
                                                  ? 1
                                                  : numberOfDays) *
                                              0.5 +
                                          roomAdditionsTotalAmount}
                                </div>
                            </div>
                        </div>
                    </div>
                </AlertDialog>

                {reservation && reserved_room?.room_status === "available" && (
                    <>
                        <div className="divider"></div>
                        <AlertDialog
                            buttonTitle="Early Check-in"
                            buttonClassname="btn btn-xl btn-success"
                            modalTitle={`Early Check-in`}
                            confirmAction={() =>
                                console.log(outStandingBalancePayment)
                            }
                            modalButtonDisabled={
                                reserved_room?.room_status !== "available"
                            }
                        >
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
                            <div className="divider m-0"></div>
                            <div className="flex gap-2 justify-between">
                                <div className="text-lg">
                                    Outstanding balance:
                                </div>
                                <div className="font-bold text-accent-content text-xl">
                                    ₱{reservation?.pending_payment}
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 items-center mt-2">
                                Confirm payment:{" "}
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-success"
                                    checked={outStandingBalancePayment !== null}
                                    onChange={() => {
                                        setOutStandingBalancePayment((prev) =>
                                            prev === null
                                                ? reservation?.pending_payment ??
                                                  0
                                                : null
                                        );
                                    }}
                                />
                            </div>
                        </AlertDialog>
                    </>
                )}

                {reservation && (
                    <>
                        <div className="divider"></div>
                        <AlertDialog
                            buttonTitle="Cancel Reservation"
                            buttonClassname="btn btn-error "
                        ></AlertDialog>
                    </>
                )}
            </Card>
        </div>
    );
};

export default RoomReservationForm;
