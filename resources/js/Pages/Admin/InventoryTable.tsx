import React from "react";

const InventoryTable = () => {
    return (
        <div className="overflow-x-auto overflow-y-auto max-h-64 ">
            <table className="table">
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Type</th>
                        <th>Stock</th>
                        <th>Available</th>
                        <th>Price / Charge</th>
                    </tr>
                </thead>
                <tbody>
                    {/* {employees.map((employee, index) => (
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
                    ))} */}
                </tbody>
            </table>
        </div>
    );
};

export default InventoryTable;
