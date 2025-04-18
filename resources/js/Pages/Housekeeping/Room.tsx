import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import { ItemToCheck, MissingItem, Room as RoomType } from "@/types";
import { router, usePage } from "@inertiajs/react";
import RoomHeader from "../Frontdesk/RoomHeader";
import FormHeader from "@/components/FormHeader";
import { useState } from "react";
import AlertDialog from "@/components/AlertDialog";

interface Props {
    room: RoomType;
    items_to_check: ItemToCheck[];
}

const Room = ({ room, items_to_check }: Props) => {
    const userRoles = usePage().props.auth.user.roles;
    const [itemsToCheck, setItemsToCheck] = useState<ItemToCheck[]>(
        items_to_check ?? []
    );
    const [damageReport, setDamageReport] = useState<string>("");

    // Separate items into checked and missing
    const missingItems = itemsToCheck.filter(
        (item) => item.quantity_checked < item.quantity_to_check
    );
    // Create the filtered variable with calculated missing values
    const missingItemsFiltered: MissingItem[] = itemsToCheck
        .filter((item) => item.quantity_checked < item.quantity_to_check)
        .map((item) => {
            const { available, in_use, in_process, sold, ...rest } = item;
            return {
                ...rest,
                missing: item.quantity_to_check - item.quantity_checked, // Calculate missing
            };
        });
    const allItemsPresent = missingItems.length === 0;

    const handleQuantityChange = (index: number, change: number) => {
        setItemsToCheck((prevItems) => {
            const newItems = [...prevItems];
            const newQuantity = newItems[index].quantity_checked + change;
            newItems[index].quantity_checked = Math.max(
                0,
                Math.min(newQuantity, newItems[index].quantity_to_check)
            );
            return newItems;
        });
    };

    const handleSubmit = async () => {
        await router.patch(route("housekeeping.submit.inspection"), {
            room_id: room.id,
            transaction_id: room.active_transaction,
            missing_items: JSON.stringify(missingItemsFiltered),
            damage_report: damageReport ?? null,
        });
    };

    return (
        <div className="flex justify-center">
            <Card className="lg:card-md card-xs">
                <BackButton
                    routeName={
                        userRoles.includes("administrator")
                            ? "housekeeping"
                            : "dashboard"
                    }
                />
                <RoomHeader room={room} />
                <div className="divider m-0"></div>

                {/* Main Items to Check Table */}
                <FormHeader className="text-start">Items to check</FormHeader>
                <div className="overflow-x-auto overflow-y-auto max-h-64 p-4 bg-base-200 rounded-xl">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Quantity checked</th>
                                <th>Quantity to check</th>
                                <th>Item</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemsToCheck.map((item, index) => (
                                <tr key={`check-${index}`}>
                                    <td>
                                        <div className="flex items-center">
                                            <button
                                                className="btn btn-square btn-xs btn-success"
                                                disabled={
                                                    item.quantity_checked === 0
                                                }
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        index,
                                                        -1
                                                    )
                                                }
                                            >
                                                -
                                            </button>
                                            <span className="w-8 text-center">
                                                {item.quantity_checked}
                                            </span>
                                            <button
                                                className="btn btn-square btn-xs btn-success"
                                                disabled={
                                                    item.quantity_checked ===
                                                    item.quantity_to_check
                                                }
                                                onClick={() =>
                                                    handleQuantityChange(
                                                        index,
                                                        1
                                                    )
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>
                                    <td>{item.quantity_to_check}</td>
                                    <td>{item.item_name}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="divider"></div>
                <FormHeader className="text-start">Damage report</FormHeader>
                <div className="bg-base-300 p-4 border-2 border-dashed rounded-lg border-base-100">
                    <textarea
                        value={damageReport}
                        onChange={(e) => setDamageReport(e.target.value)}
                        className="textarea w-full uppercase"
                        placeholder="Leave empty if none"
                    ></textarea>
                </div>

                <div className="divider"></div>
                <AlertDialog
                    confirmAction={() => handleSubmit()}
                    buttonTitle="Submit Room Check"
                    buttonClassname="btn btn-accent"
                    modalTitle="Complete Room Check"
                    modalDescription="By confirming, you verify all amenities are accounted for. This record will be saved to the housekeeping log."
                >
                    {/* Missing Items Table - Only shows if there are missing items */}
                    {!allItemsPresent && (
                        <>
                            <FormHeader className="text-start">
                                Missing Items
                            </FormHeader>
                            <div className="overflow-x-auto overflow-y-auto max-h-64 p-4 bg-base-200 rounded-xl">
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Missing Quantity</th>
                                            <th>Item</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {missingItems.map((item, index) => (
                                            <tr key={`missing-${index}`}>
                                                <td>
                                                    <span className="w-8 text-center">
                                                        {item.quantity_to_check -
                                                            item.quantity_checked}
                                                    </span>
                                                </td>
                                                <td>{item.item_name}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                    {damageReport && (
                        <>
                            <FormHeader className="text-start">
                                Damage report
                            </FormHeader>
                            <div className="p-4 bg-base-200 rounded text-error uppercase">
                                {damageReport}
                            </div>
                        </>
                    )}
                </AlertDialog>
            </Card>
        </div>
    );
};

export default Room;
