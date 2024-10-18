import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import AlertList from "../components/AlertList";
import CreateAlert from "../components/CreateAlert";

const companyID = 100001;

const Alert = () => {
    const [alerts, setAlerts] = useState([]);
    const [viewMode, setViewMode] = useState("list");

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
            return <CreateAlert alertType="employee" companyID={companyID} onCancel={() => setViewMode("list")} />;
        } else if (viewMode === "departmentAlert") {
            return <CreateAlert alertType="department" companyID={companyID} onCancel={() => setViewMode("list")} />;
        } else {
            return <AlertList alerts={alerts} companyID={companyID} />;
        }
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center justify-between">
                <h1 className="text-white text-2xl">Alert</h1>
                {viewMode === "list" && (
                    <div className="space-x-2">
                        <button 
                        className="bg-green-700 text-white text-sm p-2 mt-0 rounded-lg text-center hover:opacity-95 max-w-40"
                        onClick={() => setViewMode("employeeAlert")}>New Employee Alert</button>
                        <button 
                        className="bg-green-700 text-white text-sm p-2 mt-0 rounded-lg text-center hover:opacity-95 max-w-40"
                        onClick={() => setViewMode("departmentAlert")}>New Department Alert</button>
                    </div>
                )}
            </div>
            {renderContent()}
        </div>
    );

};

export default Alert;
