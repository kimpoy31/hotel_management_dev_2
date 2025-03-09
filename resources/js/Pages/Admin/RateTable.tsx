import { Rate } from "@/types";
import { Link } from "@inertiajs/react";
import React from "react";

const RateTable = ({ rates }: { rates: Rate[] }) => {
    return (
        <div className="overflow-x-auto overflow-y-auto max-h-64 ">
            <table className="table">
                <thead>
                    <tr>
                        <th>Duration</th>
                        <th>Rate</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {rates.map((rate, index) => (
                        <tr key={index}>
                            <th className="capitalize">
                                {rate.duration} Hour(s)
                            </th>
                            <td>₱{rate.rate}</td>

                            <td>
                                <Link
                                    href={route("rate.form", rate.id)}
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

export default RateTable;
