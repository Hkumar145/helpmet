import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import AlertList from "../components/AlertList";
import CreateEmployeeAlert from "../components/CreateEmployeeAlert";
import CreateDepartmentAlert from "../components/CreateDepartmentAlert";
import AlertToggle from "../components/AlertToggle";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";

const Alert = () => {
    const [alerts, setAlerts] = useState([]);
    const [viewMode, setViewMode] = useState("list");
    const [alertType, setAlertType] = useState("employee");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const companyID = useSelector((state) => state.user.currentUser?.companyID);

    // Fetch all alerts
    const fetchAlerts = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.get(`/companies/${companyID}/alerts`);
            // Format the sentAt date to "DD/MM/YYYY" format
            const formattedAlerts = response.data.map(alert => ({
                ...alert,
                sentAt: new Date(alert.sentAt).toLocaleDateString()
            }));
            setAlerts(formattedAlerts);
        } catch (error) {
            console.error(error);
            setError("加载失败，请稍后重试。");
        } finally {
            setLoading(false);
        }
    };

  useEffect(() => {
    fetchAlerts();
  }, []);

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
              onCancel={handleCancel}  />
          ) : (
              <CreateDepartmentAlert 
              companyID={companyID} 
              fetchAlerts={fetchAlerts} 
              onCancel={handleCancel}  />
          );
      }

      if (loading) {
          return <p className="text-center mt-6">Loading...</p>;
      }

      if (error || alerts.length === 0) {
          return (
              <div className="text-center bg-white rounded-lg py-[120px] px-6">
                  <p className="font-bold">No Alerts Available</p>
                  <p className="text-gray40 mt-2 mb-2">Start by creating the first incident alert</p>
                  <button
                      className="bg-brand40 text-white px-5 rounded text-[16px] font-semibold mt-0 hover-button"
                      onClick={() => {setViewMode("create"); setAlertType("employee")}}
                  >
                      New Incident Alert
                  </button>
              </div>
          );
      }
      return <AlertList alerts={alerts} fetchAlerts={fetchAlerts} companyID={companyID} />;
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
        <div className="flex flex-col gap-4 w-full px-4 lg:px-7 py-0 max-w-[2700px]">
            <div className="flex flex-col gap-2 mb-3 sm:mb-0 sm:flex-row items-center justify-between sm:gap-6">
                <h1 className="text-black text-[32px] font-bold">Alerts</h1>
                
                {viewMode === "list" ? (
                    <button
                        className="bg-brand40 text-white px-5 rounded text-[16px] font-semibold mt-0 hover-button"
                        onClick={() => {setViewMode("create"); setAlertType("employee")}}
                    >
                        New Incident Alert
                    </button>
                ) : (
                    <AlertToggle viewMode={alertType} setViewMode={setAlertType} />
                )}
            </div>

            <div>
                {renderContent()}
            </div>
        </div>
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
      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <Loader />
        </div>
      ) : (
        <div>{renderContent()}</div>
      )}
    </div>
  );
};

export default Alert;
