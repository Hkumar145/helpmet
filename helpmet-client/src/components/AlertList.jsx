import React, { useState, useEffect } from "react";
import Select from "react-select";
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
                // if (editedAlert.recipientType === "employee") {

                // } else if (editedAlert.recipientType === "department") {

                // }
            } catch (error) {
                console.error("Error fetching recipients:", error);
            }
        };

        // if (editMode) {
            
        // }
        fetchRecipients();
    }, [editedAlert.recipientType, editMode]);

    // Calculate total pages
    const totalPages = Math.ceil(alerts.length / itemsPerPage);

    // Get alerts for current page
    const getPaginatedAlerts = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return alerts.slice(startIndex, startIndex + itemsPerPage);
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
            <table className="bg-white p-6 rounded-lg shadow-lg w-full text-left table-fixed text-black">
                <thead>
                    <tr>
                        <th className="text-black font-bold p-2" style={{ width: "20%" }}>Alert ID</th>
                        <th className="text-black font-bold p-2" style={{ width: "40%" }}>Alert Name</th>
                        <th className="text-black font-bold p-2" style={{ width: "20%" }}>Date sent</th>
                        <th className="text-black font-bold p-2" style={{ width: "20%" }}>Actions</th>
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
                                    <button
                                    className="text-sm hover:underline ml-2"
                                    onClick={() => editAlert(alert)}
                                    >Edit
                                    </button>
                                    {/* <button 
                                        onClick={() => toggleStatus(alert.alertID)} 
                                        className={`text-sm p-2 mt-0 rounded-lg ${alert.status === "active" ? "bg-red-500" : "bg-green-500"} text-white`}>
                                        {alert.status === "active" ? "Deactivate" : "Activate"}
                                    </button> */}
                                </td>
                            </tr>
        
                            {expandedAlertID === alert.alertID && (
                                <tr>
                                    <td colSpan="4" className="p-2 bg-purple-300">
                                        <div className="whitespace-pre-wrap">
                                            <p><strong>Recipients:</strong></p>
                                            <ul>
                                                {console.log(alert)}
                                                
                                                {alert.recipients && alert.recipients.length > 0 ? (
                                                    alert.recipients.map((recipientID, idx) => {
                                                        // Parse the string of IDs into an array
                                                        const ids = recipientID[0] === '[' ? JSON.parse(recipientID) : [recipientID];
                                                        
                                                        // Map through each ID in the array
                                                        return (
                                                            <li key={idx}>
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
                                                                            {idIdx < ids.length - 1 ? ', ' : ''}
                                                                        </span>
                                                                    ) : (
                                                                        <span key={idIdx}>
                                                                            Unknown recipient
                                                                            {idIdx < ids.length - 1 ? ', ' : ''}
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
                                            <ul>
                                                {alert.cc && alert.cc.length > 0 ? (
                                                    alert.cc.map((email, idx) => (
                                                        <li key={idx}>
                                                            {JSON.parse(email)[0]}
                                                            {idx < alert.cc.length - 1 ? ',' : ''}
                                                        </li>
                                                    ))
                                                ) : (
                                                    <p>No CC recipients</p>
                                                )}
                                            </ul>
                                            <p><strong>Description:</strong> {alert.description}</p>
                                            {/* <p><strong>Attachments:</strong></p> */}
                                            {/* <div>
                                            {alert.attachments && alert.attachments.length > 0 ? (
                                                alert.attachments.map((file, idx) => (
                                                    file && file.url ? (
                                                    file.type && file.type.startsWith("image/") ? (
                                                        <img key={idx} src={file.url} alt={`attachment-${idx}`} style={{ maxWidth: "100px", maxHeight: "100px" }} />
                                                    ) : (
                                                        <a key={idx} href={file.url} download>{file.name || `attachment-${idx}`}</a>
                                                    )
                                                    ) : (
                                                    <p key={idx}>Invalid attachment</p>
                                                    )
                                                ))
                                                ) : (
                                                <p>No attachments</p>
                                                )}
                                            </div> */}
                                        </div>
                                    </td>
                                </tr>
                            )}
        
                            {editMode === alert.alertID && (
                                <tr>
                                    <td colSpan="4" className="bg-purple-300 p-4">
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
                                        {/* <Select
                                        name="recipients"
                                        value={
                                            editedAlert.recipients &&
                                            editedAlert.recipients.map((recipientID) => {
                                                if (editedAlert.recipientType === "employee") {
                                                    return allEmployees.find((e) => e.value === recipientID);
                                                } else {
                                                    return allDepartments.find((d) => d.value === recipientID);
                                                }
                                            })
                                        }
                                        options={editedAlert.recipientType === "employee" ? allEmployees : allDepartments}
                                        isMulti
                                        onChange={(selected) =>
                                            setEditedAlert({
                                                ...editedAlert,
                                                recipients: selected.map((option) => option.value),
                                            })
                                        }
                                        /> */}
                                        {/* <div>
                                            {editedAlert.attachments.length > 0 && (
                                                <ul>
                                                    {editedAlert.attachments.map((file, index) => (
                                                        <li key={index}>
                                                            {file.name} <button onClick={() => removeFile(file)}>Remove</button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                            <input type="file" multiple onChange={handleFileChange} />
                                        </div> */}

                                        <div className="mt-4">
                                            <button
                                                className="bg-green-700 text-white p-2 rounded mr-2"
                                                onClick={saveChanges}
                                            >
                                                Save
                                            </button>
                                            <button
                                                className="bg-red-700 text-white p-2 rounded"
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
            {/* Pagination controls */}
            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className={`p-2 mt-0 rounded ${currentPage === 1 ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"} text-white text-sm`}>
                    Previous
                </button>
                <span className="text-black text-sm">Page {currentPage} of {totalPages}</span>
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
