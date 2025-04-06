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

    // Rooms
    const getRooms = async () => {
        await axios
            .get(route("fetch.rooms"))
            .then((response) => setRooms(response.data));
    };
    // Reservations
    const getReservations = async () => {
        await axios
            .get(route("fetch.reservations"))
            .then((response) => setReservations(response.data));
    };

    // Fetch all data on mount
    useEffect(() => {
        getRooms();
        getReservations();
    }, []);

    return (
        <ApiContext.Provider value={{ rooms, reservations }}>
            {children}
        </ApiContext.Provider>
    );
};

export const useApi = (): ApiContextProps => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error("useApi must be used within an ApiProvider");
    }
    return context;
};
