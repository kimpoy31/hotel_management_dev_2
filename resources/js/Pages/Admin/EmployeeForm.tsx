import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import { User, UserRoles } from "@/types";
import { router } from "@inertiajs/react";
import React, { useEffect, useState } from "react";

interface Props {
    errors: Record<string, string[]>;
    employee?: User;
}

const EmployeeForm = ({ errors, employee }: Props) => {
    const [fullname, setFullname] = useState(employee?.fullname ?? "");
    const [username, setUsername] = useState(employee?.username ?? "");
    const [frontdesk, setFrontdesk] = useState(
        employee?.roles.includes("frontdesk") ?? false
    );
    const [housekeeper, setHousekeeper] = useState(
        employee?.roles.includes("housekeeper") ?? false
    );
    const [roles, setRoles] = useState<UserRoles[]>([]);

    useEffect(() => {
        let newRoles = [] as UserRoles[];

        frontdesk && newRoles.push("frontdesk");
        housekeeper && newRoles.push("housekeeper");

        setRoles([...newRoles]);
    }, [frontdesk, housekeeper]);

    const handleSubmit = async () => {
        await router.post(route("employee.form.submit", employee?.id), {
            fullname,
            username,
            roles,
        });
    };

    return (
        <div className="flex flex-col gap-2">
            <BackButton routeName="admin" />
            <Card>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Fullname</legend>
                    <input
                        type="text"
                        className="input input-lg"
                        value={fullname}
                        onChange={(e) => setFullname(e.target.value)}
                    />
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Username</legend>
                    <input
                        type="text"
                        className="input input-lg"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && (
                        <div className="text-error">
                            {errors.username.map((error) => error)}
                        </div>
                    )}
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Roles</legend>
                    <label className="fieldset-label">
                        <input
                            type="checkbox"
                            checked={frontdesk}
                            onChange={(e) => setFrontdesk(e.target.checked)}
                            className="checkbox bg-neutral"
                        />
                        <span className="text-lg">Frontdesk</span>
                    </label>
                    <label className="fieldset-label">
                        <input
                            type="checkbox"
                            onChange={(e) => setHousekeeper(e.target.checked)}
                            checked={housekeeper}
                            className="checkbox bg-neutral"
                        />
                        <span className="text-lg">Housekeeper</span>
                    </label>
                </fieldset>
                <div className="divider"></div>
                <button
                    onClick={() => handleSubmit()}
                    className="btn btn-accent"
                    disabled={!fullname || !username || roles.length < 1}
                >
                    {employee ? "Update employee" : "Add employee"}
                </button>
            </Card>
        </div>
    );
};

export default EmployeeForm;
