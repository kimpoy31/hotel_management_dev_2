import { InventoryItem, Notification, Reservation, Room } from "@/types";
import { router, usePage } from "@inertiajs/react";
import axios from "axios";
import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";

// Define the shape of the context
interface ApiContextProps {
    rooms: Room[];
    reservations: Reservation[];
    inventoryItems: InventoryItem[];
    notifications: Notification[];
    closeNotification: (id: number) => void;
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const userRoles = usePage().props.auth.user.roles;

    // Fetch Rooms
    const getRooms = async () => {
        try {
            const response = await axios.get(route("fetch.rooms"));
            setRooms(response.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
        }
    };

    // Fetch Reservations
    const getReservations = async () => {
        try {
            const response = await axios.get(route("fetch.reservations"));
            setReservations(response.data);
        } catch (error) {
            console.error("Error fetching reservations:", error);
        }
    };

    // Fetch Items
    const getInventoryItems = async () => {
        try {
            const response = await axios.get(route("fetch.items"));
            setInventoryItems(response.data);
        } catch (error) {
            console.error("Error fetching items:", error);
        }
    };

    const closeNotification = (notif_id: number) => {
        setNotifications(
            notifications.filter((notif) => notif.notif_id !== notif_id)
        );
    };

    useEffect(() => {
        getRooms();
        getReservations();
        getInventoryItems();
    }, []);

    useEffect(() => {
        if (!(window as any).Echo) {
            console.warn("Echo is not initialized");
            return;
        }

        // Room status channel
        const roomChannel = (window as any).Echo.channel("rooms.status");
        roomChannel.listen("RoomStatusUpdated", (e: { signal: string }) => {
            if (e.signal === "status_updated") {
                getRooms();
            }
        });

        // Reservation channel
        const reservationChannel = (window as any).Echo.channel(
            "reserved.rooms.status"
        );
        reservationChannel.listen(
            "ReservedRoomStatusUpdated",
            (e: { signal: string }) => {
                if (e.signal === "status_updated") {
                    getReservations();
                }
            }
        );

        // Room status channel
        const inventoryItemChannel = (window as any).Echo.channel(
            "inventory.items.status"
        );
        inventoryItemChannel.listen(
            "InventoryItemStatusUpdated",
            (e: { signal: string }) => {
                if (e.signal === "status_updated") {
                    getInventoryItems();
                }
            }
        );

        // Notification channel
        userRoles.forEach((role) => {
            const notificationChannel = (window as any).Echo.private(
                `notification.${role}`
            );

            notificationChannel.listen(
                "NotificationEvent",
                (e: Notification) => {
                    // Update notifications state
                    setNotifications((prevNotifications) => {
                        // Check if notification with this notif_id already exists
                        const exists = prevNotifications.some(
                            (notif) => notif.notif_id === e.notif_id
                        );

                        // If it doesn't exist, append the new notification
                        if (!exists) {
                            return [
                                ...prevNotifications,
                                {
                                    notif_id: e.notif_id,
                                    title: e.title,
                                    description: e.description,
                                    room_number: e.room_number,
                                    is_db_driven: e.is_db_driven,
                                },
                            ];
                        }

                        // If it exists, return the previous array unchanged
                        return prevNotifications;
                    });

                    // Get fresh URL inside the listener
                    if (
                        route().current("frontdesk.room.form") ||
                        route().current("housekeeping.room.form")
                    ) {
                        router.reload();
                    }
                }
            );
        });

        // Cleanup function
        return () => {
            roomChannel.stopListening("RoomStatusUpdated");
            reservationChannel.stopListening("ReservedRoomStatusUpdated");
            inventoryItemChannel.stopListening("InventoryItemStatusUpdated");
            userRoles.forEach((role) => {
                (window as any).Echo.leave(`notification.${role}`);
            });
        };
    }, []);

    return (
        <ApiContext.Provider
            value={{
                rooms,
                reservations,
                inventoryItems,
                notifications,
                closeNotification,
            }}
        >
            {children}
        </ApiContext.Provider>
    );
};

// Custom hook to access the context
export const useApi = (): ApiContextProps => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error("useApi must be used within an ApiProvider");
    }
    return context;
};
