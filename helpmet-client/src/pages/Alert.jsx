import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import AlertList from "../components/AlertList";
import CreateEmployeeAlert from "../components/CreateEmployeeAlert";
import CreateDepartmentAlert from "../components/CreateDepartmentAlert";
import AlertToggle from "../components/AlertToggle";
import { useSelector } from "react-redux";

const Alert = () => {
  const [alerts, setAlerts] = useState([]);
  const [viewMode, setViewMode] = useState("list");
  const [alertType, setAlertType] = useState("employee");
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  // Fetch all alerts
  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`/companies/${companyID}/alerts`);
      // Format the sentAt date to "YYYY-MM-DD" format
      const formattedAlerts = response.data.map((alert) => ({
        ...alert,
        sentAt: new Date(alert.sentAt).toISOString().split("T")[0],
      }));
      setAlerts(formattedAlerts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const toggleAlertType = () => {
    setAlertType((prevType) =>
      prevType === "employee" ? "department" : "employee"
    );
  };

  // Function to reset view mode to "list"
  const handleCancel = () => {
    setViewMode("list");
  };

  // Render different components based on viewMode
  const renderContent = () => {
    if (viewMode === "create") {
      return alertType === "employee" ? (
        <CreateEmployeeAlert
          companyID={companyID}
          fetchAlerts={fetchAlerts}
          onCancel={handleCancel}
        />
      ) : (
        <CreateDepartmentAlert
          companyID={companyID}
          fetchAlerts={fetchAlerts}
          onCancel={handleCancel}
        />
      );
    }
    return (
      <AlertList
        alerts={alerts}
        fetchAlerts={fetchAlerts}
        companyID={companyID}
      />
    );
  };

  return (
    <div className="flex flex-col gap-4 w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between sm:gap-6">
        <h1 className="text-black text-[32px] font-bold">Alerts</h1>

        {viewMode === "list" ? (
          <button
            className="bg-brand40 text-white px-5 rounded text-[16px] font-semibold mt-0 hover-button"
            onClick={() => {
              setViewMode("create");
              setAlertType("employee");
            }}
          >
            New Incident Alert
          </button>
        ) : (
          <AlertToggle viewMode={alertType} setViewMode={setAlertType} />
        )}
      </div>

      <div>{renderContent()}</div>
    </div>
  );
};

export default Alert;
