export interface User {
    id: number;
    fullname: string;
    username: string;
    roles: UserRoles[];
    status: Status;
}

export interface InventoryItem {
    id: number;
    item_name: string;
    item_type: ItemType;
    available: number;
    in_use?: number | null;
    in_process?: number | null;
    sold?: number | null;
    missing?: number | null;
    price: number;
    status: Status;
}
export interface Rate {
    id: number;
    duration: number;
    rate: number;
    status: Status;
}

export interface InclusionItem {
    item_id: number;
    quantity: number;
    type: ItemType;
}
export interface AdditionItem {
    item_id: number;
    quantity: number;
    type: ItemType;
    price: number;
    name: string;
}

export interface Transaction {
    id: number;
    transaction_officer: string;
    check_in: string; // ISO date format (e.g., "2025-03-15T14:30:00Z")
    check_out?: string;
    expected_check_out: string;
    latest_rate_availed_id: number;
    number_of_hours: number;
    rate: number;
    room_number: string;
    customer_name: string;
    customer_address: string;
    customer_contact_number?: string;
    id_picture_path?: string;
    room_additions?: AdditionItem[]; // Adjust type based on expected structure
    total_payment: number;
    missing_items?: any[]; // Adjust type based on expected structure
    damaged_items?: string;
    settlement_payment?: number;
    pending_payment: number | null;
    overtime_charge: number;
    transaction_logs: TransactionLog[];
    notified_checkout_warning_at: string;
}

export interface Notification {
    notif_id: number;
    title: string;
    description: string;
    room_number: string;
}

export interface TransactionLog {
    id: number;
    transaction_id: number;
    transaction_officer: string;
    transaction_type:
        | "check-in"
        | "checkout"
        | "upgrade"
        | "extend"
        | "room addition";
    transaction_description: string;
    status: "active" | "in-active";
    created_at: string;
}

export interface Room {
    id: number;
    room_number: string;
    room_type: string;
    room_rate_ids: number[];
    room_rates: Rate[];
    room_inclusions?: InclusionItem[];
    room_inclusion_items: InventoryItem[];
    room_status: RoomStatus;
    active_transaction?: number | null;
    room_reservation_ids: number[];
    active_transaction_object: Transaction | null;
    status: "active" | "in-active";
}

export interface Reservation {
    id: number;
    reserved_room_id: number;
    room_additions?: AdditionItem[]; // Assuming an array of objects
    rate_availed_id: number;
    check_in_datetime: string; // ISO format datetime
    expected_check_out: string;
    number_of_hours: number;
    number_of_days: number;
    guest_name: string;
    guest_address: string;
    guest_contact_number: string;
    total_payment: number;
    pending_payment: number;
    transaction_officer: string;
    reservation_status: "pending" | "completed" | "cancelled";
}

export type Status = "active" | "in-active";
export type UserRoles = "administrator" | "frontdesk" | "housekeeper";
export type ItemType = "room amenity" | "consumable";
export type RoomStatus =
    | "available"
    | "occupied"
    | "pending_inspection"
    | "pending_settlement"
    | "cleaning"
    | "reserved"
    | "out_of_service"
    | "under_maintenance"
    | "no_show"
    | "blocked";

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
