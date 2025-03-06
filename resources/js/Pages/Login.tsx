import AlertDialog from "@/components/AlertDialog";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

interface Props {
    error: string;
    success: string;
}

const Login = ({ error, success }: Props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [resetPassword, setResetPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await router.post(route("login.post"), { username, password });
    };

    const handleResetAdminPassword = async () => {
        await router.patch(route("admin.reset.password"), {
            reset_password: resetPassword,
        });
    };

    return (
        <div className="flex justify-center h-screen py-36">
            <div className="card w-full max-w-sm bg-base-100 card-md shadow-sm h-fit ">
                <form onSubmit={(e) => handleSubmit(e)} className="card-body">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Username</legend>
                        <input
                            type="text"
                            className="input input-lg w-full"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Password</legend>
                        <input
                            type="password"
                            className="input input-lg w-full"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </fieldset>
                    <AlertDialog
                        buttonTitle="Reset admin password"
                        buttonClassname="text-start text-accent-content capitalize uppercase"
                        modalTitle="Reset admin password"
                        confirmButtonClassname="btn-accent"
                        confirmAction={() => handleResetAdminPassword()}
                        confirmButtonDisabled={resetPassword.length < 3}
                    >
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">
                                Reset password
                            </legend>
                            <input
                                type="password"
                                className="input input-lg w-full"
                                value={resetPassword}
                                onChange={(e) =>
                                    setResetPassword(e.target.value)
                                }
                            />
                        </fieldset>
                    </AlertDialog>
                    <div className="divider"></div>
                    {error && (
                        <div className="bg-error text-error-content text-center py-1">
                            {error}
                        </div>
                    )}
                    {success && (
                        <div className="bg-success text-success-content text-center py-1">
                            {success}
                        </div>
                    )}
                    <button className="btn btn-accent">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
