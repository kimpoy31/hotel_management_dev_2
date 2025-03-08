export interface User {
    id: number;
    fullname: string;
    username: string;
    roles: UserRoles[];
}

export type UserRoles = "administrator" | "frontdesk" | "housekeeper";

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
