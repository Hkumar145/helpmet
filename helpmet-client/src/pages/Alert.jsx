import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import AlertList from "../components/AlertList";
import CreateAlert from "../components/CreateAlert";
import AlertToggle from "@/components/AlertToggle";
import { useSelector } from "react-redux";

const Alert = () => {
    const [alerts, setAlerts] = useState([]);
    const [viewMode, setViewMode] = useState("list");
    const companyID = useSelector((state) => state.user.currentUser?.companyID);

    // Fetch all alerts
    const fetchAlerts = async () => {
        try {
            const response = await axios.get(`/companies/${companyID}/alerts`);
            // Format the sentAt date to "YYYY-MM-DD" format
            const formattedAlerts = response.data.map(alert => ({
                ...alert,
                sentAt: new Date(alert.sentAt).toISOString().split("T")[0]
            }));
            setAlerts(formattedAlerts);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => { fetchAlerts(); }, []);

    // Render different components based on viewMode
    const renderContent = () => {
        if (viewMode === "employeeAlert") {
            return <CreateAlert alertType="employee" companyID={companyID} fetchAlerts={fetchAlerts} onCancel={() => setViewMode("list")} />;
        } else if (viewMode === "departmentAlert") {
            return <CreateAlert alertType="department" companyID={companyID} fetchAlerts={fetchAlerts} onCancel={() => setViewMode("list")} />;
        } else {
            return <AlertList alerts={alerts} fetchAlerts={fetchAlerts} companyID={companyID} />;
        }
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {/* Title and Toggle Button */}
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-white text-2xl">Alert</h1>

                {/* Toggle button component */}
                <AlertToggle viewMode={viewMode} setViewMode={setViewMode} />
            </div>

            {/* Content section */}
            <div className="mt-4">
                {renderContent()}
            </div>
        </div>
    );

};

export default Alert;
