import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import RoomCard from "@/components/RoomCard";
import { Room as RoomProp } from "@/types";
import RoomHeader from "./RoomHeader";
import DisplayRoomInclusions from "@/components/DisplayRoomInclusions";
import FormHeader from "@/components/FormHeader";
import { useState } from "react";
import CustomerInformationForm from "./CustomerInformationForm";

interface Props {
    room: RoomProp;
}

const Room = ({ room }: Props) => {
    const [customerName, setCustomerName] = useState("");
    const [customerAddress, setCustomerAddress] = useState("");
    const [customerContactNumber, setCustomerContactNumber] = useState("");
    const [customerIDPicture, setCustomerIDpicture] = useState<File | null>(
        null
    );

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
            <div className="divider m-0"></div>
            <CustomerInformationForm
                customerName={customerName}
                setCustomerName={setCustomerName}
                customerAddress={customerAddress}
                setCustomerAddress={setCustomerAddress}
                customerContactNumber={customerContactNumber}
                setCustomerContactNumber={setCustomerContactNumber}
            />
        </Card>
    );
};

export default Room;
