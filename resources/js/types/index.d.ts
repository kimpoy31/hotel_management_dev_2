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
