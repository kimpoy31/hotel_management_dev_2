import FormHeader from "@/components/FormHeader";
import React from "react";

const DamageReport = ({ damage_report }: { damage_report: string }) => {
    return (
        <>
            <FormHeader className="bg-base-100!">Damage Report</FormHeader>
            <textarea
                value={damage_report}
                // onChange={(e) => setDamageReport(e.target.value)}
                className="textarea w-full uppercase disabled:text-error"
                placeholder="Leave empty if none"
                disabled
            ></textarea>
        </>
    );
};

export default DamageReport;
