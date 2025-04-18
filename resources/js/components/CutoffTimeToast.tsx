import { useApi } from "@/context/ApiProvider";
import { Notification } from "@/types";
import { X } from "lucide-react";

interface Props {
    notification: Notification;
}

const CutoffTimeToast = ({ notification }: Props) => {
    const { closeNotification } = useApi();

    return (
        <div className="alert alert-warning ">
            <button
                className="btn btn-square btn-ghost btn-warning"
                onClick={() => closeNotification(notification.notif_id)}
            >
                <X size={24} />
            </button>

            <div className="flex-col flex text-wrap">
                <div className="flex flex-wrap items-center gap-x-2 text-lg">
                    <h1 className="font-bold">{notification.title}</h1>
                </div>
                <div className="flex items-center gap-1">
                    <div className="flex text-center items-center rounded gap-1">
                        <span className="uppercase text-sm font-bold">
                            Room
                        </span>
                        {notification.room_number}
                    </div>
                    is {notification.description}
                </div>
            </div>
        </div>
    );
};

export default CutoffTimeToast;
