import { router } from "@inertiajs/react";
import React, { useState } from "react";

interface Props {
    error: string;
}

const Login = ({ error }: Props) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        await router.post(route("login.post"), { username, password });
    };

    return (
        <div className="flex justify-center py-36">
            <div className="card w-full max-w-lg bg-base-100 card-md shadow-sm">
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
                    <div className="divider"></div>
                    {error && (
                        <div className="bg-error text-error-content text-center py-1">
                            {error}
                        </div>
                    )}
                    <button className="btn btn-accent">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
