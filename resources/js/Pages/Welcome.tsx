import React from "react";
import Frontdesk from "./Frontdesk";
import { usePage } from "@inertiajs/react";
import Housekeeping from "./Housekeeping";
import Card from "@/components/Card";
import FormHeader from "@/components/FormHeader";
import { useApi } from "@/context/ApiProvider";
import AvailableItemsTable from "./DashboardComponents/AvailableItemsTable";
import InUseItemsTable from "./DashboardComponents/InUseItemsTable";
import InProcessItemsTable from "./DashboardComponents/InProcessItemsTable";
import MissingItemsTable from "./DashboardComponents/MissingItemsTable";
import TotalStockTable from "./DashboardComponents/TotalStockTable";

const Welcome = () => {
    const userRole = usePage().props.auth.user.roles;
    const { inventoryItems } = useApi();

    return (
        <Card className="lg:card-md card-xs">
            {userRole.includes("frontdesk") &&
                !userRole.includes("administrator") && <Frontdesk />}
            {userRole.includes("housekeeper") &&
                !userRole.includes("administrator") && <Housekeeping />}
        </Card>
    );
};

export default Welcome;
