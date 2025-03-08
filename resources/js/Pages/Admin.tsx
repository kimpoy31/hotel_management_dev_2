import Card from "@/components/Card";
import { User } from "@/types";
import { Link } from "@inertiajs/react";
import React from "react";

interface Props {
    employees: User[];
}

const Admin = ({ employees }: Props) => {
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
                <div className="overflow-x-auto overflow-y-auto max-h-64 ">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Fullname</th>
                                <th>Username</th>
                                <th>Roles</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((employee, index) => (
                                <tr key={index}>
                                    <th className="capitalize">
                                        {employee.fullname}
                                    </th>
                                    <td>{employee.username}</td>
                                    <td>{employee.roles.join(", ")}</td>
                                    <td>
                                        <Link
                                            href={route(
                                                "employee.form",
                                                employee.id
                                            )}
                                            className="btn btn-xs btn-primary"
                                        >
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Admin;
