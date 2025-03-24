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
    overtime_charge: number;
}

export interface Room {
    id: number;
    room_number: string;
    room_type: string;
    room_rate_ids: number[]; // Assuming room rates is a key-value pair of rates
    room_rates: Rate[];
    room_inclusions?: InclusionItem[]; // Nullable array of strings for inclusions
    room_inclusion_items: InventoryItem[]; // Nullable array of strings for inclusions
    room_status:
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
    active_transaction?: number | null; // Nullable number for active transaction
    status: "active" | "in-active";
}

export type Status = "active" | "in-active";
export type UserRoles = "administrator" | "frontdesk" | "housekeeper";
export type ItemType = "room amenity" | "consumable";

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
