export interface User {
    id: number;
    fullname: string;
    username: string;
    roles: UserRoles[];
    status: Status;
}

export type Status = "active" | "in-active";
export type UserRoles = "administrator" | "frontdesk" | "housekeeper";

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
