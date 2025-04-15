import FormHeader from "@/components/FormHeader";
import { TransactionLog } from "@/types";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

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
                            <th>Transaction</th>
                            <th>Processed by</th>
                            <th>Transaction Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaction_logs.map((transaction, index) => (
                            <tr key={index}>
                                <td className="min-w-sm">
                                    {transaction.transaction_description}
                                </td>
                                <td>{transaction.transaction_officer}</td>
                                <td>
                                    {dayjs(transaction.created_at)
                                        .tz("Asia/Manila")
                                        .format("MMM D, YYYY")}{" "}
                                    {dayjs(transaction.created_at)
                                        .tz("Asia/Manila")
                                        .format("h:mm A")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionLogs;
