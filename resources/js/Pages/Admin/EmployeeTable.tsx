import { User } from "@/types";
import { Link } from "@inertiajs/react";

const EmployeeTable = ({ employees }: { employees: User[] }) => {
    return (
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
                            <th className="capitalize">{employee.fullname}</th>
                            <td>{employee.username}</td>
                            <td>{employee.roles.join(", ")}</td>
                            <td>
                                <Link
                                    href={route("employee.form", employee.id)}
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
    );
};

export default EmployeeTable;
