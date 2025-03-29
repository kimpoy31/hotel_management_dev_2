import { RoomStatus } from "@/types";
import { useState, useEffect } from "react";

interface CountdownTimerProps {
    expected_check_out: string; // Example: "2025-03-30T08:00:00"
    overtime_penalty: number; // Amount charged per hour of overtime
    roomStatus?: RoomStatus;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
    expected_check_out,
    overtime_penalty,
    roomStatus,
}) => {
    const [timeLeft, setTimeLeft] = useState(getTimeLeft());

    function getTimeLeft() {
        const now = new Date().getTime();
        const targetTime = new Date(expected_check_out).getTime();

        if (isNaN(targetTime))
            return { time: "00:00:00", isOvertime: false, penalty: 0 };

        const difference = targetTime - now;
        const isOvertime = difference < 0;

        const absDifference = Math.abs(difference); // Absolute time difference

        let hours = Math.floor(absDifference / (1000 * 60 * 60));
        const minutes = Math.floor(
            (absDifference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((absDifference % (1000 * 60)) / 1000);

        if (isOvertime && (minutes > 0 || seconds > 0)) {
            hours += 1; // Round up overtime to the next hour
        }

        const formattedTime = `${String(hours).padStart(2, "0")}:${String(
            minutes
        ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

        return {
            time: isOvertime ? `+${formattedTime}` : formattedTime,
            isOvertime,
            penalty: isOvertime ? hours * overtime_penalty : 0,
        };
    }

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(getTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [expected_check_out, overtime_penalty]);

    return (
        <div
            className={`text-center font-bold bg-base-200 p-2 ${
                timeLeft.isOvertime ? "text-error" : "text-success"
            }`}
        >
            {roomStatus === "available" ? "Vacant" : timeLeft.time}
            {timeLeft.isOvertime ? (
                <div className="text-xs font-semibold">
                    Penalty: ₱{timeLeft.penalty}
                </div>
            ) : (
                <div className="text-xs font-semibold">-</div>
            )}
        </div>
    );
};

export default CountdownTimer;
