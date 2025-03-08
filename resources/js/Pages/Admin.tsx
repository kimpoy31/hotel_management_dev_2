import Card from "@/components/Card";
import { Link } from "@inertiajs/react";
import React from "react";

interface Props {}

const Admin = ({}: Props) => {
    return (
        <div className="w-full flex items-center flex-col">
            <Card>
                <div className="flex justify-between">
                    <h2 className="card-title">Employee manager</h2>
                    <Link
                        href={route("employee.form")}
                        className="btn btn-sm btn-accent"
                    >
                        Add employee
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Admin;
