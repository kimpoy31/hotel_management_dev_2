import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import RoomCard from "@/components/RoomCard";
import { Room as RoomProp } from "@/types";
import RoomHeader from "./RoomHeader";

interface Props {
    room: RoomProp;
}

const Room = ({ room }: Props) => {
    return (
        <Card className="lg:card-md card-xs">
            <BackButton routeName="frontdesk" />
            <RoomHeader room={room} />
        </Card>
    );
};

export default Room;
