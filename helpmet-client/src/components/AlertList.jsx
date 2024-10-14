import React, { useState } from "react";
import axios from "../api/axios";
import AlertDetail from "../components/AlertDetail";


const AlertList = ({ alerts, companyID, fetchAlerts }) => {
    const [expandedAlertID, setExpandedAlertID] = useState(null);
    const [editMode, setEditMode] = useState(null);

    // View details of an alert
    const viewDetails = (alertID) => {
        if (expandedAlertID === alertID) {
            setExpandedAlertID(null);
        } else {
            setExpandedAlertID(alertID);
        }
    };

    return (
        <table>
            <thead>
                <tr>
                    <th>Alert ID</th>
                    <th>Alert Name</th>
                    <th>Date sent</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {alerts.map((alert) => (
                    <React.Fragment key={alert.alertID}>
                        <tr>
                            <td>{ alert.alertID }</td>
                            <td>{ alert.alertName }</td>
                            <td>{ alert.sentAt }</td>
                            <td>
                                <button onClick={() => viewDetails(alert.alertID)}>
                                    {expandedAlertID === alert.alertID ? "Hide Details" : "View Details"}
                                </button>
                            </td>
                        </tr>
    
                        {expandedAlertID === alert.alertID && (
                            <tr>
                                <td colSpan="5">
                                    <div>
                                        <p><strong>Description:</strong> {alert.description}</p>
                                    </div>
                                </td>
                            </tr>
                        )}
    
                        {editMode === alert.alertID && (
                            <tr>
                                <td colSpan="5">
                                    <AlertDetail
                                        alert={alert}
                                        onSave={saveChanges}
                                        onCancel={() => setEditMode(null)}
                                    />
                                </td>
                            </tr>
                        )}
                    </React.Fragment>
                ))}
            </tbody>
        </table>
    );
    
};

export default AlertList;
