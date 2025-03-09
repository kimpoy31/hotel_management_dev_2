import AlertDialog from "@/components/AlertDialog";
import BackButton from "@/components/BackButton";
import Card from "@/components/Card";
import ErrorMessage from "@/components/ErrorMessage";
import { Rate } from "@/types";
import { router } from "@inertiajs/react";
import React, { useState } from "react";

interface Props {
    errors: Record<string, string[]>;
    rate?: Rate;
}
const RateForm = ({ rate: rateToEdit, errors }: Props) => {
    const [duration, setDuration] = useState(rateToEdit?.duration ?? 0);
    const [rate, setRate] = useState(rateToEdit?.rate ?? 0);

    const handleSubmit = async () => {
        await router.post(route("rate.form.submit", rateToEdit?.id), {
            duration,
            rate,
        });
    };

    const deleteRate = async () => {
        await router.patch(route("rate.delete", rateToEdit?.id));
    };

    return (
        <div className="flex flex-col gap-2">
            <BackButton routeName="admin" />
            <Card>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">
                        Duration / Hour(s)
                    </legend>
                    <input
                        type="number"
                        className="input input-lg"
                        value={duration > 0 ? duration : ""}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                    />
                    {errors.duration && (
                        <ErrorMessage>
                            {errors.duration.map((error) => error)}
                        </ErrorMessage>
                    )}
                </fieldset>
                <fieldset className="fieldset">
                    <legend className="fieldset-legend">Price / Rate</legend>
                    <input
                        type="number"
                        className="input input-lg"
                        value={rate > 0 ? rate : ""}
                        onChange={(e) => setRate(parseFloat(e.target.value))}
                    />
                    {errors.rate && (
                        <ErrorMessage>
                            {errors.rate.map((error) => error)}
                        </ErrorMessage>
                    )}
                </fieldset>
                {rateToEdit && (
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend text-error">
                            Delete rate
                        </legend>
                        <AlertDialog
                            confirmAction={() => deleteRate()}
                            buttonTitle="Delete"
                            buttonClassname="btn btn-error w-fit"
                            modalTitle={`Delete rate`}
                            modalDescription={`Are you sure you want to delete rate ${
                                rateToEdit.duration +
                                " Hour(s) - ₱" +
                                rateToEdit.rate
                            }`}
                        />
                    </fieldset>
                )}
                {errors.delete_error && (
                    <ErrorMessage>
                        {errors.delete_error.map((error) => error)}
                    </ErrorMessage>
                )}
                <div className="divider"></div>
                <button
                    className="btn btn-accent"
                    onClick={() => handleSubmit()}
                    disabled={
                        duration < 1 ||
                        rate < 1 ||
                        isNaN(duration) ||
                        isNaN(rate)
                    }
                >
                    {rateToEdit ? "Update" : "Add rate"}
                </button>
            </Card>
        </div>
    );
};

export default RateForm;
