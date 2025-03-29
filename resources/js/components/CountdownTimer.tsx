import { RoomStatus } from "@/types";
import { useState, useEffect, useCallback } from "react";

interface CountdownTimerProps {
    expected_check_out: string;
    overtime_penalty: number;
    roomStatus?: RoomStatus;
    className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
    expected_check_out,
    overtime_penalty,
    roomStatus,
    className,
}) => {
    const getTimeLeft = useCallback(() => {
        console.log("Expected Check-Out (Raw):", expected_check_out);

        const targetTime = new Date(expected_check_out);
        const now = new Date();
        const targetTimestamp = targetTime.getTime();

        if (isNaN(targetTimestamp)) {
            return { time: "00:00:00", isOvertime: false, totalHours: 0 };
        }

        const difference = targetTimestamp - now.getTime();
        const isOvertime = difference < 0;
        const absDifference = Math.abs(difference);

        // Calculate total hours, always rounding up for overtime
        const totalHours = isOvertime
            ? Math.ceil(absDifference / (1000 * 60 * 60))
            : 0;

        // For display purposes
        const hours = Math.floor(absDifference / (1000 * 60 * 60));
        const minutes = Math.floor(
            (absDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((absDifference % (1000 * 60)) / 1000);

        const formattedTime = `${String(hours).padStart(2, "0")}:${String(
            minutes
        ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        return {
            time: isOvertime ? `+${formattedTime}` : formattedTime,
            isOvertime,
            totalHours,
        };
    }, [expected_check_out]);

    const [timeLeft, setTimeLeft] = useState(getTimeLeft);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [getTimeLeft]);

    return (
        <div
            className={`text-center font-bold bg-base-200 p-2 ${
                timeLeft.isOvertime ? "text-error" : "text-success"
            } ${className}`}
        >
            {roomStatus === "available" ? "Vacant" : timeLeft.time}
            {timeLeft.isOvertime ? (
                <div className="text-xs font-semibold">
                    Total Overtime: {timeLeft.totalHours} hours
                </div>
            ) : (
                <div className="text-xs font-semibold">-</div>
            )}
        </div>
    );
};

export default CountdownTimer;
