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

    // Fetch all data on mount
    useEffect(() => {
        getRooms();
        getReservations();

        // Ensure Echo is initialized
        if ((window as any).Echo) {
            console.log("Reverb is working");

            // Listen to the event for updates (make sure the event name is correct)
            const channel = (window as any).Echo.channel("rooms.status");

            channel.listen("RoomStatusUpdated", (e: { signal: string }) => {
                if (e.signal === "status_updated") {
                    console.log("yey its working");

                    getRooms(); // Re-fetch rooms data when status is updated
                }
            });

            // Cleanup function to stop listening when the component unmounts
            return () => {
                channel.stopListening("RoomStatusUpdated");
            };
        } else {
            console.warn("Echo is not initialized");
        }
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
