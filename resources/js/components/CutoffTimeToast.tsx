import { useApi } from "@/context/ApiProvider";
import { Notification } from "@/types";
import axios from "axios";
import { X } from "lucide-react";

interface Props {
    notification: Notification;
}

const CutoffTimeToast = ({ notification }: Props) => {
    const { closeNotification } = useApi();

    const markAsRead = async () => {
        if (notification.is_db_driven) {
            await axios.patch(route("notification.flag.read"), {
                notif_id: notification.notif_id,
            });
        }

        closeNotification(notification.notif_id);
    };

    return (
        <div className="alert alert-warning ">
            <button
                className="btn btn-square btn-ghost btn-warning"
                onClick={() => markAsRead()}
            >
                <X size={24} />
            </button>

            <div className="flex-col flex text-wrap">
                <div className="flex flex-wrap items-center gap-x-2 text-lg">
                    <h1 className="font-bold">{notification.title}</h1>
                </div>
                <div className="gap-1 text-wrap">
                    <span className="font-bold">
                        Room {notification.room_number}{" "}
                    </span>
                    is {notification.description}
                </div>
            </div>
        </div>
    );
};

export default CutoffTimeToast;
