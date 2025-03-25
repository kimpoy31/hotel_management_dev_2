import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import RoomCard from "@/components/RoomCard";
import {
    AdditionItem,
    InventoryItem,
    Rate,
    Room as RoomProp,
    Transaction,
} from "@/types";
import RoomHeader from "./RoomHeader";
import DisplayRoomInclusions from "@/components/DisplayRoomInclusions";
import FormHeader from "@/components/FormHeader";
import { useState } from "react";
import CustomerInformationForm from "./CustomerInformationForm";
import CheckInForm from "./CheckInForm";
import SetRoomAdditions from "./SetRoomAdditions";
import AlertDialog from "@/components/AlertDialog";
import { router } from "@inertiajs/react";

interface Props {
    room: RoomProp;
    rates: Rate[];
    inventory_items: InventoryItem[];
    errors: Record<string, string | string[]>;
    active_transaction: Transaction | null;
}

export const getExpectedCheckoutDatetime = (
    checkInTime: Date | string,
    durationInHours: number
): Date => {
    let checkInDate: Date;

    if (typeof checkInTime === "string") {
        checkInDate = new Date(checkInTime);
    } else {
        checkInDate = checkInTime;
    }

    if (isNaN(checkInDate.getTime())) {
        throw new Error("Invalid check-in time");
    }

    const checkoutDate = new Date(checkInDate.getTime());
    checkoutDate.setHours(checkoutDate.getHours() + durationInHours);

    if (durationInHours > 23) {
        checkoutDate.setHours(12, 0, 0, 0); // Set time to 12:00 noon
    }

    return checkoutDate;
};

const Room = ({
    room,
    rates,
    inventory_items,
    errors,
    active_transaction,
}: Props) => {
    // Customer information
    const [customerName, setCustomerName] = useState(
        active_transaction?.customer_name ?? ""
    );
    const [customerAddress, setCustomerAddress] = useState(
        active_transaction?.customer_address ?? ""
    );
    const [customerContactNumber, setCustomerContactNumber] = useState(
        active_transaction?.customer_contact_number ?? ""
    );
    const [customerIDPicture, setCustomerIDpicture] = useState<File | null>(
        null
    );

    // OCCUPIED ROOM VARIABLES
    const [stayExtensionId, setStayExtensionId] = useState(0);
    const [roomRateUpgradeId, setRoomRateUpgradeId] = useState(0);

    // Room variable
    const [roomRateId, setRoomRateId] = useState(0);
    const [numberOfDays, setNumberOfDays] = useState<number>(1);
    const [roomAdditions, setRoomAdditions] = useState<AdditionItem[]>(
        active_transaction?.room_additions ?? []
    );
    const [newRoomAdditions, setNewRoomAdditions] = useState<AdditionItem[]>(
        []
    );

    // LOCAL VARS
    let roomRate = rates.find((rate) => rate.id === roomRateId) ?? null;
    let TotalAmountToPay = roomAdditions.reduce(
        (total, item) => total + item.price * item.quantity,
        parseFloat(roomRate?.rate.toString() ?? "0") *
            (numberOfDays && numberOfDays > 0 ? numberOfDays : 1)
    );
    const [checkInTime, setCheckInTime] = useState(new Date());

    const checkIn = async () => {
        let numberOfHours =
            roomRate!.duration < 24
                ? roomRate!.duration
                : 24 *
                  (!isNaN(numberOfDays) && numberOfDays > 0 ? numberOfDays : 1);
        let expected_check_out = getExpectedCheckoutDatetime(
            checkInTime,
            numberOfHours
        );

        await router.post(route("frontdesk.check_in"), {
            rate_id: roomRateId,
            room_id: room.id,
            room_additions: JSON.stringify(roomAdditions),
            check_in: checkInTime,
            latest_rate_availed_id: roomRateId,
            expected_check_out,
            number_of_hours: numberOfHours,
            rate: roomRate?.rate,
            room_number: room.room_number,
            customer_name: customerName,
            customer_address: customerAddress,
            customer_contact_number: customerContactNumber,
            id_picture: customerIDPicture,
            total_payment: TotalAmountToPay,
        });

        setNumberOfDays(1);
        setRoomRateId(0);
    };

    return (
        <Card className="lg:card-md card-xs ">
            <BackButton routeName="frontdesk" />
            <RoomHeader room={room} />
            <div className="divider m-0"></div>
            <DisplayRoomInclusions
                roomInclusionItems={room.room_inclusion_items ?? []}
                roomInclusions={room.room_inclusions ?? []}
                withHeader={true}
            />
            <CustomerInformationForm
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerAddress={customerAddress}
                setCustomerAddress={setCustomerAddress}
                customerContactNumber={customerContactNumber}
                setCustomerContactNumber={setCustomerContactNumber}
                customerIDPicture={customerIDPicture}
                setCustomerIDpicture={setCustomerIDpicture}
                errors={errors}
                room_transaction={active_transaction}
            />
            <CheckInForm
                roomRateId={roomRateId}
                rates={rates}
                setRoomRateId={setRoomRateId}
                numberOfDays={numberOfDays}
                setNumberOfDays={setNumberOfDays}
                active_transaction={active_transaction}
                setStayExtensionId={setStayExtensionId}
                stayExtensionId={stayExtensionId}
                roomRateUpgradeId={roomRateUpgradeId}
                setRoomRateUpgradeId={setRoomRateUpgradeId}
                roomDetails={room}
            />
            <SetRoomAdditions
                inventoryItems={inventory_items}
                roomAdditions={roomAdditions}
                setRoomAdditions={setRoomAdditions}
                newRoomAdditions={newRoomAdditions}
                setNewRoomAdditions={setNewRoomAdditions}
                active_transaction={active_transaction}
                room_id={room.id}
            />

            {/* Check in button */}
            <AlertDialog
                buttonTitle="Check-in"
                buttonClassname="btn btn-accent"
                modalTitle="Collect total amount"
                modalClassName="max-w-lg"
                modalButtonDisabled={
                    !customerName ||
                    !customerAddress ||
                    !customerContactNumber ||
                    roomRateId < 1
                }
                modalButtonOnClick={() => setCheckInTime(new Date())}
                cancelButtonName="Cancel"
                confirmAction={() => checkIn()}
            >
                <div className="divider m-0"></div>
                <div className="flex gap-2">
                    <h1> Customer name: </h1>
                    <span className="capitalize font-bold">{customerName}</span>
                </div>
                <div className="flex gap-2">
                    <h1> Check-in: </h1>
                    <span className="capitalize font-bold">
                        {checkInTime.toDateString()}{" "}
                        {checkInTime.toLocaleTimeString()}
                    </span>
                </div>
                <div className="flex gap-2">
                    <h1> Expected checkout: </h1>
                    <span className="capitalize font-bold">
                        {getExpectedCheckoutDatetime(
                            checkInTime,
                            (roomRate?.duration ?? 0) *
                                (numberOfDays > 0 ? numberOfDays : 1)
                        ).toDateString()}{" "}
                        {getExpectedCheckoutDatetime(
                            checkInTime,
                            (roomRate?.duration ?? 0) *
                                (numberOfDays > 0 ? numberOfDays : 1)
                        ).toLocaleTimeString()}
                    </span>
                </div>
                <div className="divider m-0"></div>
                <div className="flex justify-between text-lg">
                    <h1>
                        Room rate -{" "}
                        {numberOfDays &&
                        roomRate?.duration &&
                        roomRate?.duration > 23 ? (
                            <span>
                                {numberOfDays < 1 ? 1 : numberOfDays} Day(s)
                            </span>
                        ) : (
                            <span>{roomRate?.duration} Hours</span>
                        )}
                    </h1>
                    <div className="flex flex-col items-center">
                        <span className="capitalize font-bold">
                            ₱
                            {roomRate &&
                                roomRate?.rate *
                                    (numberOfDays && numberOfDays > 0
                                        ? numberOfDays
                                        : 1)}
                        </span>
                    </div>
                </div>
                {roomAdditions.length > 0 &&
                    roomAdditions.map((additionItem, index) => (
                        <div
                            className="flex justify-between text-lg"
                            key={index}
                        >
                            <h1>
                                {additionItem.name} - {additionItem.quantity}{" "}
                                pc(s)
                            </h1>
                            <span className="capitalize font-bold">
                                ₱{additionItem.price * additionItem.quantity}
                            </span>
                        </div>
                    ))}
                <div className="divider m-0"></div>
                <div className="flex justify-between text-lg mb-4">
                    <h1>Total amount</h1>
                    <div className="flex flex-col items-center">
                        <span className="capitalize font-bold text-2xl">
                            ₱{TotalAmountToPay}
                        </span>
                    </div>
                </div>
                <div className="text-center bg-base-200 p-1 px-4 rounded">
                    Please collect the total indicated amount, then click
                    "Confirm."
                </div>
            </AlertDialog>
        </Card>
    );
};

export default Room;

// let roomRate = active_transaction
// ? rates.find((rate) => rate.id === stayExtensionId) ?? null
// : rates.find((rate) => rate.id === roomRateId) ?? null;

// const isBeforeTwoPM = () => {
// const now = new Date();
// const twoPM = new Date();
// twoPM.setHours(14, 0, 0, 0); // Set to 2:00 PM today

// return now < twoPM;
// };

// (((roomRate?.duration ?? 0) > 23 && isBeforeTwoPM()) ??
//                 false)
