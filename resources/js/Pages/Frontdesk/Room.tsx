import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import RoomCard from "@/components/RoomCard";
import { AdditionItem, InventoryItem, Rate, Room as RoomProp } from "@/types";
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
}

const Room = ({ room, rates, inventory_items, errors }: Props) => {
    // Customer information
    const [customerName, setCustomerName] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerContactNumber, setCustomerContactNumber] = useState("");
    const [customerIDPicture, setCustomerIDpicture] = useState<File | null>(
        null
    );
    // Room variable
    const [roomRateId, setRoomRateId] = useState(0);
    const [numberOfDays, setNumberOfDays] = useState<number>(1);
    const [roomAdditions, setRoomAdditions] = useState<AdditionItem[]>([]);
    // LOCAL VARS
    let roomRate = rates.find((rate) => rate.id === roomRateId) ?? null;
    let TotalAmountToPay = roomAdditions.reduce(
        (total, item) => total + item.price * item.quantity,
        parseFloat(roomRate?.rate.toString() ?? "0") *
            (numberOfDays && numberOfDays > 0 ? numberOfDays : 1)
    );
    const [checkInTime, setCheckInTime] = useState(new Date());

    function getCheckoutDateTime(
        checkInDateTime: string | Date,
        numberOfHours: number
    ): Date {
        if (!checkInDateTime || typeof numberOfHours !== "number") {
            throw new Error("Invalid input");
        }

        const checkInDate = new Date(checkInDateTime);
        if (isNaN(checkInDate.getTime())) {
            throw new Error("Invalid date");
        }

        // Add hours
        checkInDate.setHours(checkInDate.getHours() + numberOfHours);

        return checkInDate;
    }

    const checkIn = async () => {
        let numberOfHours =
            roomRate!.duration < 24
                ? roomRate!.duration
                : 24 *
                  (!isNaN(numberOfDays) && numberOfDays > 0 ? numberOfDays : 1);
        let expected_check_out = getCheckoutDateTime(
            checkInTime,
            numberOfHours
        );

        await router.post(route("frontdesk.check_in"), {
            room_id: room.id,
            room_additions: JSON.stringify(roomAdditions),
            check_in: checkInTime,
            expected_check_out,
            number_of_hours: numberOfHours,
            number_of_days:
                roomRate?.duration && roomRate?.duration >= 24
                    ? numberOfDays
                    : 0,
            rate: roomRate?.rate,
            room_number: room.room_number,
            customer_name: customerName,
            customer_address: customerAddress,
            customer_contact_number: customerContactNumber,
            id_picture: customerIDPicture,
            total_payment: TotalAmountToPay,
        });
    };

    return (
        <Card className="lg:card-md card-xs">
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
            />
            <CheckInForm
                roomRateId={roomRateId}
                rates={rates}
                setRoomRateId={setRoomRateId}
                numberOfDays={numberOfDays}
                setNumberOfDays={setNumberOfDays}
            />
            <SetRoomAdditions
                inventoryItems={inventory_items}
                roomAdditions={roomAdditions}
                setRoomAdditions={setRoomAdditions}
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
                <div className="divider m-0"></div>
                <div className="flex justify-between text-lg">
                    <h1>
                        Room rate -{" "}
                        {numberOfDays ? (
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
