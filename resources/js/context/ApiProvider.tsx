import { Reservation, Room } from "@/types";
import { router } from "@inertiajs/react";
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
}

const ApiContext = createContext<ApiContextProps | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [reservations, setReservations] = useState<Reservation[]>([]);

    // Fetch Rooms
    const getRooms = async () => {
        try {
            const response = await axios.get(route("fetch.rooms"));
            setRooms(response.data);

            console.log("fetched data");
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

    useEffect(() => {
        getRooms();
        getReservations();
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

        // Cleanup function
        return () => {
            roomChannel.stopListening("RoomStatusUpdated");
            reservationChannel.stopListening("ReservedRoomStatusUpdated");
        };
    }, []);

    return (
        <ApiContext.Provider value={{ rooms, reservations }}>
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
