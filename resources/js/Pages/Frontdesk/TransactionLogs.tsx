import FormHeader from "@/components/FormHeader";
import { TransactionLog } from "@/types";
import React from "react";

interface Props {
    transaction_logs: TransactionLog[];
}

const TransactionLogs = ({ transaction_logs }: Props) => {
    return (
        <div>
            <FormHeader className="text-start">Transaction Logs</FormHeader>
            <div className="overflow-x-auto overflow-y-auto max-h-64 bg-zinc-800 border-4 border-base-100 border-dashed">
                <table className="table table-pin-rows table-sm">
                    <thead className="uppercase">
                        <tr>
                            <th>Transaction Date</th>
                            <th>Transaction</th>
                            <th>Processed by</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaction_logs.map((transaction, index) => (
                            <tr key={index}>
                                <td>
                                    {new Date(
                                        transaction.created_at
                                    ).toDateString()}{" "}
                                    {new Date(
                                        transaction.created_at
                                    ).toLocaleDateString()}
                                </td>
                                <td>{transaction.transaction_description}</td>
                                <td>{transaction.transaction_officer}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionLogs;
