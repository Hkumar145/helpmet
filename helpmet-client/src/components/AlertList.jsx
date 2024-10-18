import React, { useState } from "react";
import AlertDetail from "../components/AlertDetail";


const AlertList = ({ alerts }) => {
    const [expandedAlertID, setExpandedAlertID] = useState(null);
    const [editMode, setEditMode] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Calculate total pages
    const totalPages = Math.ceil(alerts.length / itemsPerPage);

    // Get alerts for current page
    const getPaginatedAlerts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return alerts.slice(startIndex, startIndex + itemsPerPage);
    };

    // Handle page changes
    const goToNextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    // View details of an alert
    const viewDetails = (alertID) => {
        if (expandedAlertID === alertID) {
            setExpandedAlertID(null);
        } else {
            setExpandedAlertID(alertID);
        }
    };

    return (
        <div>
            <table className="bg-gray-800 p-6 rounded-lg shadow-lg w-full text-left table-fixed text-white">
                <thead>
                    <tr>
                        <th className="text-white font-bold p-2" style={{ width: "20%" }}>Alert ID</th>
                        <th className="text-white font-bold p-2" style={{ width: "40%" }}>Alert Name</th>
                        <th className="text-white font-bold p-2" style={{ width: "20%" }}>Date sent</th>
                        <th style={{ width: "20%" }}></th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {getPaginatedAlerts().map((alert) => (
                        <React.Fragment key={alert.alertID}>
                            <tr>
                                <td className="p-2" style={{ width: "20%" }}>{ alert.alertID }</td>
                                <td className="p-2" style={{ width: "40%" }}>{ alert.alertName }</td>
                                <td className="p-2" style={{ width: "20%" }}>{ alert.sentAt }</td>
                                <td className="p-2" style={{ width: "20%" }}>
                                    <button 
                                    className="text-sm hover:underline mt-0"
                                    onClick={() => viewDetails(alert.alertID)}>
                                        {expandedAlertID === alert.alertID ? "Hide Details" : "View Details"}
                                    </button>
                                </td>
                            </tr>
        
                            {expandedAlertID === alert.alertID && (
                                <tr>
                                    <td colSpan="4" className="p-2 bg-gray-700">
                                        <div className="whitespace-pre-wrap">
                                            <p><strong>Description:</strong> {alert.description}</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
        
                            {/* {editMode === alert.alertID && (
                                <tr>
                                    <td colSpan="4">
                                        <AlertDetail
                                            alert={alert}
                                            onSave={saveChanges}
                                            onCancel={() => setEditMode(null)}
                                        />
                                    </td>
                                </tr>
                            )} */}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
            {/* Pagination controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`p-2 mt-0 rounded ${currentPage === 1 ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} text-white text-sm`}>
                    Previous
                </button>
                <span className="text-white text-sm">Page {currentPage} of {totalPages}</span>
                <button
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className={`p-2 mt-0 rounded ${currentPage === totalPages ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} text-white text-sm`}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default AlertList;
