import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import RoomCard from "@/components/RoomCard";
import {
    AdditionItem,
    InventoryItem,
    Rate,
    Room as RoomProp,
    Transaction,
} from "@/types";
import RoomHeader from "./RoomHeader";
import DisplayRoomInclusions from "@/components/DisplayRoomInclusions";
import FormHeader from "@/components/FormHeader";
import { useState } from "react";
import CustomerInformationForm from "./CustomerInformationForm";
import CheckInForm, { formatTransactionDuration } from "./CheckInForm";
import SetRoomAdditions from "./SetRoomAdditions";
import AlertDialog from "@/components/AlertDialog";
import { router } from "@inertiajs/react";
import TransactionLogs from "./TransactionLogs";
import CountdownTimer from "@/components/CountdownTimer";

interface Props {
    room: RoomProp;
    rates: Rate[];
    inventory_items: InventoryItem[];
    errors: Record<string, string | string[]>;
    active_transaction: Transaction | null;
}

export const calculateOvertimeHours = (input: string | Date): number => {
    const givenDate = new Date(input);
    const now = new Date();

    if (isNaN(givenDate.getTime()) || givenDate >= now) {
        return 0;
    }

    const diffMs = now.getTime() - givenDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);

    return diffHours + 1; // Always round up
};

const Room = ({
    room,
    rates,
    inventory_items,
    errors,
    active_transaction,
}: Props) => {
    // Customer information
    const [customerName, setCustomerName] = useState(
        active_transaction?.customer_name ?? ""
    );
    const [customerAddress, setCustomerAddress] = useState(
        active_transaction?.customer_address ?? ""
    );
    const [customerContactNumber, setCustomerContactNumber] = useState(
        active_transaction?.customer_contact_number ?? ""
    );
    const [customerIDPicture, setCustomerIDpicture] = useState<File | null>(
        null
    );

    // OCCUPIED ROOM VARIABLES
    const [stayExtensionId, setStayExtensionId] = useState(0);
    const [roomRateUpgradeId, setRoomRateUpgradeId] = useState(0);

    // Room variable
    const [roomRateId, setRoomRateId] = useState(0);
    const [numberOfDays, setNumberOfDays] = useState<number>(1);
    const [roomAdditions, setRoomAdditions] = useState<AdditionItem[]>(
        active_transaction?.room_additions ?? []
    );
    const [newRoomAdditions, setNewRoomAdditions] = useState<AdditionItem[]>(
        []
    );

    // LOCAL VARS
    let roomRate = rates.find((rate) => rate.id === roomRateId) ?? null;
    let TotalAmountToPay = roomAdditions.reduce(
        (total, item) => total + item.price * item.quantity,
        parseFloat(roomRate?.rate.toString() ?? "0") *
            (numberOfDays && numberOfDays > 0 ? numberOfDays : 1)
    );

    // Checkout vars
    const [collectOvertimeCharge, setCollectOvertimeCharge] = useState(true);

    const checkIn = async () => {
        let numberOfHours =
            roomRate!.duration < 24
                ? roomRate!.duration
                : 24 *
                  (!isNaN(numberOfDays) && numberOfDays > 0 ? numberOfDays : 1);

        await router.post(route("frontdesk.check_in"), {
            rate_id: roomRateId,
            room_id: room.id,
            room_additions: JSON.stringify(roomAdditions),
            latest_rate_availed_id: roomRateId,
            number_of_hours: numberOfHours,
            rate: roomRate?.rate,
            room_number: room.room_number,
            customer_name: customerName,
            customer_address: customerAddress,
            customer_contact_number: customerContactNumber,
            id_picture: customerIDPicture,
            total_payment: TotalAmountToPay,
        });

        setNumberOfDays(1);
        setRoomRateId(0);
    };

    const checkOut = async () => {
        await router.patch(route("frontdesk.checkout"), {
            overtime_charge: collectOvertimeCharge
                ? calculateOvertimeHours(
                      active_transaction?.expected_check_out ?? new Date()
                  ) * (active_transaction?.overtime_charge ?? 0)
                : 0,
            pending_payment: active_transaction?.pending_payment ?? 0,
            transaction_id: active_transaction?.id,
            room_id: room.id,
        });
    };

    return (
        <div className="flex justify-center">
            <Card className="lg:card-md card-xs">
                <BackButton routeName="frontdesk" />
                <RoomHeader room={room} />
                <div className="divider m-0"></div>

                <DisplayRoomInclusions
                    roomInclusionItems={room.room_inclusion_items ?? []}
                    roomInclusions={room.room_inclusions ?? []}
                    withHeader={true}
                />
                <CustomerInformationForm
                    customerName={customerName}
                    setCustomerName={setCustomerName}
                    customerAddress={customerAddress}
                    setCustomerAddress={setCustomerAddress}
                    customerContactNumber={customerContactNumber}
                    setCustomerContactNumber={setCustomerContactNumber}
                    customerIDPicture={customerIDPicture}
                    setCustomerIDpicture={setCustomerIDpicture}
                    errors={errors}
                    room_transaction={active_transaction}
                />
                <CheckInForm
                    roomRateId={roomRateId}
                    rates={rates}
                    setRoomRateId={setRoomRateId}
                    numberOfDays={numberOfDays}
                    setNumberOfDays={setNumberOfDays}
                    active_transaction={active_transaction}
                    setStayExtensionId={setStayExtensionId}
                    stayExtensionId={stayExtensionId}
                    roomRateUpgradeId={roomRateUpgradeId}
                    setRoomRateUpgradeId={setRoomRateUpgradeId}
                    roomDetails={room}
                />
                {(room.room_status === "occupied" ||
                    room.room_status === "available" ||
                    room.room_status === "pending_inspection") && (
                    <SetRoomAdditions
                        inventoryItems={inventory_items}
                        roomAdditions={roomAdditions}
                        setRoomAdditions={setRoomAdditions}
                        newRoomAdditions={newRoomAdditions}
                        setNewRoomAdditions={setNewRoomAdditions}
                        active_transaction={active_transaction}
                        room_id={room.id}
                        roomStatus={room.room_status}
                    />
                )}

                {active_transaction && (
                    <TransactionLogs
                        transaction_logs={active_transaction.transaction_logs}
                    />
                )}

                <div className="divider"></div>
                {room.room_status === "occupied" && (
                    <CountdownTimer
                        expected_check_out={
                            active_transaction?.expected_check_out ?? ""
                        }
                        overtime_penalty={
                            active_transaction?.overtime_charge ?? 0
                        }
                        roomStatus={room.room_status}
                        className="text-xl text-center"
                    />
                )}
                {/* Check in button */}
                {room.room_status === "available" && (
                    <AlertDialog
                        buttonTitle="Check-in"
                        buttonClassname="btn btn-accent"
                        modalTitle="Collect total amount"
                        modalClassName="max-w-lg"
                        modalButtonDisabled={
                            !customerName ||
                            !customerAddress ||
                            !customerContactNumber ||
                            roomRateId < 1
                        }
                        cancelButtonName="Cancel"
                        confirmAction={() => checkIn()}
                    >
                        <div className="divider m-0"></div>
                        <div className="flex gap-2">
                            <h1> Guest name: </h1>
                            <span className="capitalize font-bold">
                                {customerName}
                            </span>
                        </div>

                        <div className="divider m-0"></div>

                        <div className="flex flex-col items-center text-nowrap bg-base-200 p-2">
                            <div className="uppercase italic font-bold">
                                Stay duration
                            </div>
                            <div className="font-bold flex gap-1.5 text-lg ">
                                <div>
                                    {formatTransactionDuration(
                                        (roomRate?.duration ?? 0) *
                                            (numberOfDays < 1
                                                ? 1
                                                : numberOfDays)
                                    )}{" "}
                                </div>
                            </div>
                        </div>

                        {roomAdditions.length > 0 &&
                            roomAdditions.map((additionItem, index) => (
                                <div
                                    className="flex justify-between text-lg"
                                    key={index}
                                >
                                    <h1>
                                        {additionItem.name} -{" "}
                                        {additionItem.quantity} pc(s)
                                    </h1>
                                    <span className="capitalize font-bold">
                                        ₱
                                        {additionItem.price *
                                            additionItem.quantity}
                                    </span>
                                </div>
                            ))}
                        <div className="divider m-0"></div>
                        <div className="flex justify-between text-lg mb-4">
                            <h1>Total amount</h1>
                            <div className="flex flex-col items-center">
                                <span className="capitalize font-bold text-2xl">
                                    ₱{TotalAmountToPay}
                                </span>
                            </div>
                        </div>
                        <div className="text-center bg-base-200 p-1 px-4 rounded">
                            Please collect the total indicated amount, then
                            click "Confirm."
                        </div>
                    </AlertDialog>
                )}
                {room.room_status === "occupied" && (
                    <>
                        <div className="divider"></div>
                        <AlertDialog
                            buttonTitle="Checkout"
                            buttonClassname="btn btn-secondary"
                            modalTitle="Checkout"
                            confirmAction={() => checkOut()}
                        >
                            This will finalize the transaction for{" "}
                            <span className="font-bold text-lg text-accent-content">
                                {active_transaction?.customer_name}
                            </span>{" "}
                            . Please collect any pending payment or charges (if
                            any) indicated below before proceeding. Proceed with
                            checkout?
                            <div className="divider my-0"></div>
                            <div className="flex justify-between">
                                Overtime charge:
                                <div className="font-extrabold">
                                    ₱{" "}
                                    {collectOvertimeCharge
                                        ? calculateOvertimeHours(
                                              active_transaction?.expected_check_out ??
                                                  new Date()
                                          ) *
                                          (active_transaction?.overtime_charge ??
                                              0)
                                        : 0}
                                </div>
                            </div>
                            <div className="flex justify-between">
                                Pending payment:
                                <div className="font-extrabold">
                                    ₱ {active_transaction?.pending_payment ?? 0}
                                </div>
                            </div>
                            <div className="divider my-0"></div>
                            <div className="flex justify-between items-center bg-base-200 p-2">
                                Collect overtime charge:
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-success"
                                    checked={collectOvertimeCharge}
                                    onChange={() => {
                                        setCollectOvertimeCharge(
                                            !collectOvertimeCharge
                                        );
                                    }}
                                />
                            </div>
                            <div className="divider m-0"></div>
                            <div className="flex justify-between mb-4">
                                Total amount:
                                <div className="font-extrabold text-2xl">
                                    ₱
                                    {(active_transaction?.pending_payment ??
                                        0) +
                                        (collectOvertimeCharge
                                            ? calculateOvertimeHours(
                                                  active_transaction?.expected_check_out ??
                                                      new Date()
                                              ) *
                                              (active_transaction?.overtime_charge ??
                                                  0)
                                            : 0)}
                                </div>
                            </div>
                        </AlertDialog>
                    </>
                )}
            </Card>
        </div>
    );
};

export default Room;
