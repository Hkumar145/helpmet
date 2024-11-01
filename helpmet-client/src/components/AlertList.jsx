import React, { useState, useEffect } from "react";
import axios from "../api/axios";


const AlertList = ({ alerts, companyID, fetchAlerts }) => {
    const [expandedAlertID, setExpandedAlertID] = useState(null);
    const [editedAlert, setEditedAlert] = useState({ recipients: [], attachments: [] });
    const [allEmployees, setAllEmployees] = useState([]);
    const [allDepartments, setAllDepartments] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    // Fetch recipients (employees or departments) based on recipientType
    useEffect(() => {
        const fetchRecipients = async () => {
            try {
                const response = await axios.get(`/companies/${companyID}/employees`);
                setAllEmployees(response.data.map(employee => ({
                    value: employee.employeeID,
                    label: `${employee.employeeID} - ${employee.firstName} ${employee.lastName}`
                })));
                const response2 = await axios.get(`/companies/${companyID}/departments`);
                setAllDepartments(response2.data.map(department => ({
                    value: department.departmentID,
                    label: `${department.departmentID} - ${department.departmentName}`
                })));                
            } catch (error) {
                console.error("Error fetching recipients:", error);
            }
        };

        fetchRecipients();
    }, [editedAlert.recipientType, editMode]);

    // Sort alerts in descending order
    const sortedAlerts = [...alerts].sort((a, b) => {
        const idA = parseInt(a.alertID.replace(/[^\d]/g, ""), 10);
        const idB = parseInt(b.alertID.replace(/[^\d]/g, ""), 10);
        return idB - idA;
    });

    // Calculate total pages
    const totalPages = Math.ceil(sortedAlerts.length / itemsPerPage);

    // Get alerts for current page
    const getPaginatedAlerts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return sortedAlerts.slice(startIndex, startIndex + itemsPerPage);
    };

    // Handle edit mode
    const editAlert = (alert) => {
        setEditMode(alert.alertID);
        setEditedAlert({
            ...alert,
            recipients: alert.recipients || [],
            attachments: alert.attachments || []
        });
    };

    // Handle form input changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedAlert((prev) => ({ ...prev, [name]: value }));
    };

    // Save the edited alert
    const saveChanges = async () => {
        try {
            await axios.put(`/alerts/${editedAlert.alertID}`, editedAlert);
            setEditMode(null);
            fetchAlerts();
        } catch (error) {
            console.error("Error saving alert:", error);
        }
    };

    // Handle file input changes
    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setEditedAlert((prev) => ({
            ...prev,
            attachments: [...prev.attachments, ...selectedFiles]
        }));
    };

    // Remove file from attachments
    const removeFile = (fileToRemove) => {
        setEditedAlert((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((file) => file !== fileToRemove),
        }));
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

    const toggleStatus = async (alertID) => {
        try {
            await axios.put(`/alerts/${alertID}/status`);
            fetchAlerts();
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    return (
        <div>
            <table className="bg-gray-800 p-6 rounded-lg shadow-lg w-full text-left table-fixed text-white">
                <thead className="text-center">
                    <tr className="text-xs lg:text-lg transition-all duration-300">
                        <th className="text-white fontbold p-1" style={{ width: "20%" }}>Alert ID</th>
                        <th className="text-white font-bold p-1" style={{ width: "40%" }}>Alert Name</th>
                        <th className="text-white font-bold p-1" style={{ width: "20%" }}>Date sent</th>
                        <th className="text-white font-bold p-1" style={{ width: "20%" }}>Actions</th>
                    </tr>
                </thead>
                <tbody className="text-xs lg:text-sm transition-all duration-300 text-center">
                    {getPaginatedAlerts().map((alert) => (
                        <React.Fragment key={alert.alertID}>
                            <tr className="border-t border-gray-700">
                                <td className="p-1 w-1/4 md:w-1/5 lg:w-1/4">{ alert.alertID }</td>
                                <td className="p-1 w-1/2 md:w-2/5 lg:w-1/2">{ alert.alertName }</td>
                                <td className="p-1 w-1/4 md:w-1/5 lg:w-1/4">{ alert.sentAt }</td>
                                <td className="p-1 w-full md:w-1/5 lg:w-1/4">
                                    <div className="flex flex-col md:flex-row gap-2 justify-center">
                                        <button 
                                            className="text-xs lg:text-sm transition-all duration-300 bg-blue-500 text-white px-2 lg:px-4 py-1 rounded mt-0"
                                            onClick={() => viewDetails(alert.alertID)}>
                                                {expandedAlertID === alert.alertID ? "Hide" : "View"}
                                        </button>
                                        <button
                                            className="text-xs lg:text-sm transition-all duration-300 bg-green-500 text-white px-2 lg:px-4 py-1 rounded mt-0"
                                            onClick={() => editAlert(alert)}
                                        >Edit
                                        </button>
                                        {/* <button 
                                            onClick={() => toggleStatus(alert.alertID)} 
                                            className={`text-sm p-2 mt-0 rounded-lg ${alert.status === "active" ? "bg-red-500" : "bg-green-500"} text-white`}>
                                            {alert.status === "active" ? "Deactivate" : "Activate"}
                                        </button> */}
                                    </div>
                                </td>
                            </tr>
        
                            {expandedAlertID === alert.alertID && (
                                <tr>
                                    <td colSpan="4" className="p-2 bg-gray-700">
                                        <div className="whitespace-pre-wrap text-start">
                                            <p><strong>Recipients:</strong></p>
                                            <ul className="border-b-2 border-gray-500 mb-2">
                                              
                                                {alert.recipients && alert.recipients.length > 0 ? (
                                                    alert.recipients.map((recipientID, idx) => {
                                                        // Parse the string of IDs into an array
                                                        const ids = recipientID[0] === "[" ? JSON.parse(recipientID) : [recipientID];
                                                        
                                                        // Map through each ID in the array
                                                        return (
                                                            <li key={idx} className="text-gray-300">
                                                                {ids.map((id, idIdx) => {
                                                                    let employee = allEmployees.find(e => e.value === id);
                                                                    if (!employee)
                                                                    {
                                                                        employee = allDepartments.find(e => e.value === id);
                                                                    }
                                                                    console.log(employee);
                                                                    return employee ? (
                                                                        <span key={idIdx}>
                                                                            {employee.label}
                                                                            {idIdx < ids.length - 1 ? ", " : ""}
                                                                        </span>
                                                                    ) : (
                                                                        <span key={idIdx}>
                                                                            Unknown recipient
                                                                            {idIdx < ids.length - 1 ? ", " : ""}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </li>
                                                        );
                                                    })
                                                ) : (
                                                    <p>No recipients</p>
                                                )}
                                            </ul>
                                       
                                            <p><strong>CC:</strong></p>
                                            <ul className="border-b-2 border-gray-500 mb-2">
                                                {alert.cc && alert.cc.length > 0 ? (
                                                    alert.cc.map((email, idx) => {
                                                        const parsedEmails = email[0] === "[" ? JSON.parse(email) : [email];
                                                        return (
                                                            <li key={idx} className="text-gray-300">
                                                                {parsedEmails.map((parsedEmail, emailIdx) => (
                                                                    <span key={emailIdx}>
                                                                        {parsedEmail}
                                                                        {emailIdx < parsedEmails.length - 1 ? ", " : ""}
                                                                    </span>
                                                                ))}
                                                                {idx < alert.cc.length - 1 ? ", " : ""}
                                                            </li>
                                                        );
                                                    })
                                                ) : (
                                                    <p className="text-gray-300">No CC recipients</p>
                                                )}
                                            </ul>

                                            <p><strong>Description:</strong></p>
                                            <p className="text-gray-300">{alert.description}</p>

                                        </div>
                                    </td>
                                </tr>
                            )}
        
                            {editMode === alert.alertID && (
                                <tr>
                                    <td colSpan="4" className="bg-gray-600 p-4">
                                        <input
                                            type="text"
                                            name="alertName"
                                            value={editedAlert.alertName}
                                            onChange={handleInputChange}
                                            className="w-full p-2"
                                        />
                                        <textarea
                                            name="description"
                                            value={editedAlert.description}
                                            onChange={handleInputChange}
                                            className="w-full p-2 mt-2"
                                        ></textarea>
                                        
                                        <div className="mt-4 flex gap-2 justify-end">
                                            <button
                                                className="bg-green-700 text-white p-2 rounded mt-0"
                                                onClick={saveChanges}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-red-700 text-white p-2 rounded mt-0"
                                                onClick={() => setEditMode(null)}
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
          
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
