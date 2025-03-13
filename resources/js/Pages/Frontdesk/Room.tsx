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

interface Props {
    room: RoomProp;
    rates: Rate[];
    inventory_items: InventoryItem[];
}

const Room = ({ room, rates, inventory_items }: Props) => {
    // Customer information
    const [customerName, setCustomerName] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerContactNumber, setCustomerContactNumber] = useState("");
    const [customerIDPicture, setCustomerIDpicture] = useState<File | null>(
        null
    );
    // Room variable
    const [roomRateId, setRoomRateId] = useState(0);
    const [numberOfDays, setNumberOfDays] = useState<number>();
    const [roomAdditions, setRoomAdditions] = useState<AdditionItem[]>([]);

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
            <div className="divider"></div>
            <AlertDialog
                buttonTitle="Check-in"
                buttonClassname="btn btn-accent"
                modalTitle="Please collect total amount"
                modalClassName="max-w-lg"
                modalButtonDisabled={
                    !customerName ||
                    !customerAddress ||
                    !customerContactNumber ||
                    roomRateId < 1
                }
            >
                <div className="flex gap-2">
                    <h1> Customer name: </h1>
                    <span className="capitalize font-bold">{customerName}</span>
                </div>
                <div className="flex gap-2">
                    <h1> Customer address: </h1>
                    <span className="capitalize font-bold">
                        {customerAddress}
                    </span>
                </div>
                <div className="flex gap-2">
                    <h1> Customer contact number: </h1>
                    <span className="capitalize font-bold">
                        {customerContactNumber}
                    </span>
                </div>
                <div className="divider m-0"></div>
            </AlertDialog>
        </Card>
    );
};

export default Room;
