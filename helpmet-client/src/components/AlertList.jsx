import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { IconButton } from "./ui/button";
import { useSelector } from "react-redux";
import Avatar from "react-avatar";


const AlertList = ({ alerts, companyID, fetchAlerts }) => {
    const [expandedAlertID, setExpandedAlertID] = useState(null);
    const [editedAlert, setEditedAlert] = useState({ recipients: [], attachments: [] });
    const [allEmployees, setAllEmployees] = useState([]);
    const [allDepartments, setAllDepartments] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const senderEmail = useSelector((state) => state.user.email);
    const [intervals, setIntervals] = useState({});

    // Fetch recipients (employees or departments)
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
    }, [editedAlert, editMode]);

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
        setExpandedAlertID(null);
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
            alert("Alert updated successfully!");
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
            setEditMode(null);
        }
    };

    const toggleStatus = async (alertID, currentStatus, alertItem) => {
        const newStatus = currentStatus === "active" ? "deactive" : "active";
        try {
            await axios.put(`/alerts/${alertID}`, { status: newStatus });
            fetchAlerts(); 

            if (newStatus === "active") {
                alert(`Alert ID: ${alertID} has been activated and will be sent every 7 days.`);
                console.log(`Setting up interval for alert ID: ${alertID}`);
                const intervalId = setInterval(async () => {
                    try {
                        const recipientsResponse = await axios.get(`/companies/${companyID}/employees`);
                        const allEmployees = recipientsResponse.data;
                        console.log("Fetched employees:", allEmployees);
                        const recipientEmails = allEmployees.filter((employee) => {
                            return alertItem.recipients.some((recipientID) => {
                                try {
                                    const ids = Array.isArray(JSON.parse(recipientID)) ? JSON.parse(recipientID) : [recipientID];
                                    return ids.includes(employee.employeeID);
                                } catch (error) {
                                    return recipientID === employee.employeeID;
                                }
                            });
                        })
                        .map((employee) => employee.email);

                        if (recipientEmails.length === 0) {
                            console.warn("No valid recipient emails found for alert:", alertID);
                            return;
                        }

                        await axios.post("/email/send-alert-email", {
                            recipients: recipientEmails,
                            senderEmail,
                            alertDetails: {
                                alertName: alertItem.alertName,
                                description: alertItem.description,
                            },
                            cc: alertItem.cc,
                            scheduleTime: new Date().toISOString(),
                            alertID: alertID,
                        });
                        console.log(`Repeated email sent for alert ID: ${alertID}`);
                    } catch (error) {
                        console.error("Error in repeated email sending:", error);
                    }
                }, 7 * 24 * 60 * 60 * 1000); // Repeat sending alert in 7 days  7 * 24 * 60 * 60 * 1000

                // Store interval ID for clearing later
                setIntervals((prev) => ({ ...prev, [alertID]: intervalId }));
            } else {
                // Clear interval
                clearInterval(intervals[alertID]);
                setIntervals((prev) => {
                    const newIntervals = { ...prev };
                    delete newIntervals[alertID];
                    return newIntervals;
                });
                alert(`Alert ID: ${alertID} deactivated successfully. Weekly email sending canceled.`);
                console.log(`Cleared interval for alert ID: ${alertID}`);
            }
            
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="w-full overflow-x-auto">
                <table className="bg-white p-6 rounded-lg shadow-lg w-full text-left table-fixed min-w-[500px]">
                    <thead className="text-center">
                        <tr className="text-[16px] text-gray50">
                            <th className="py-3 px-1 md:px-3 font-bold" style={{ width: "15%" }}>Alert ID</th>
                            <th className="py-3 px-1 md:px-3 font-bold" style={{ width: "30%" }}>Alert Name</th>
                            <th className="py-3 px-1 md:px-3 font-bold" style={{ width: "15%" }}>Send Date</th>
                            <th className="py-3 px-1 md:px-3 font-bold" style={{ width: "20%" }}>Recipients</th>
                            <th className="py-3 px-1 md:px-3 font-bold" style={{ width: "20%" }}></th>
                        </tr>
                    </thead>
                    <tbody className="text-[14px] text-center">
                        {getPaginatedAlerts().map((alert, index) => (
                            <React.Fragment key={alert.alertID}>
                                <tr className={`border-t border-gray20 ${index % 2 === 0 ? "bg-gray10" : ""}`}>
                                    <td className="p-2 lg:px-6">{ alert.alertID }</td>
                                    <td className="p-2 lg:px-6">{ alert.alertName }</td>
                                    <td className="p-2 lg:px-6">{ alert.sentAt }</td>
                                    <td className="p-2 lg:px-6 flex flex-col md:flex-row lg:h-12 items-center gap-1">
                                        {alert.recipients && alert.recipients[0] && JSON.parse(alert.recipients[0]).slice(0, 3).map((recipientID, idx) => {
                                            const id = recipientID;
                                            const employee = allEmployees.find(e => e.value === id);
                                            const label = employee ? employee.label : "Unknown";
                                            const nameInitial = label && label.includes(" - ") ? label.split(" - ")[1].charAt(0) : "?";
                                            return (
                                                <Avatar 
                                                    key={idx}
                                                    name={nameInitial}
                                                    round={true}
                                                    size="30"
                                                    textSizeRatio={2.5} 
                                                />
                                            );
                                        })}
                                        {alert.recipients && alert.recipients[0] && JSON.parse(alert.recipients[0]).length > 3 && (
                                            <span className="text-gray60">+{JSON.parse(alert.recipients[0]).length - 3}</span>
                                        )}
                                    </td>
                                    <td className="p-2 lg:px-6">
                                        <div className="flex flex-col md:flex-row gap-2 justify-center items-center">
                                            <div className="flex justify-center">
                                                <IconButton
                                                    icon={alert.status === "active" ? "toggleActive" : "toggleInactive"}
                                                    onClick={() => toggleStatus(alert.alertID, alert.status, alert)}
                                                    style={{
                                                        backgroundColor: "transparent",
                                                        border: "none",
                                                        padding: "0px",
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <IconButton icon={expandedAlertID === alert.alertID ? "hide" : "expand"} 
                                                onClick={() => viewDetails(alert.alertID)} 
                                                className={`icon-button ${expandedAlertID === alert.alertID ? "selected" : ""}`}/>
                                            </div>
                                            <div>
                                                <IconButton icon="edit" 
                                                onClick={() => editAlert(alert)} 
                                                className={`icon-button ${editMode === alert.alertID ? "selected" : ""}`} />
                                            </div>
                                        </div>
                                    </td>
                                </tr>
            
                                {expandedAlertID === alert.alertID && (
                                    <tr>
                                        <td colSpan="5" className="px-3 py-2 lg:px-6 bg-gray20">
                                            <div className="whitespace-pre-wrap text-start">
                                                <div className="flex gap-1">
                                                    <p><strong>Recipients:</strong></p>
                                                    <ul>
                                                        {alert.recipients && alert.recipients.length > 0 ? (
                                                            alert.recipients.map((recipientID, idx) => {
                                                                // Parse the string of IDs into an array
                                                                const ids = recipientID[0] === "[" ? JSON.parse(recipientID) : [recipientID];
                                                                // Map through each ID in the array
                                                                return (
                                                                    <li key={idx} className="text-black">
                                                                        {ids.map((id, idIdx) => {
                                                                            let employee = allEmployees.find(e => e.value === id);
                                                                            if (!employee)
                                                                            {
                                                                                employee = allDepartments.find(e => e.value === id);
                                                                            }
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
                                                </div>
                                                
                                                <div className="flex gap-1">
                                                    <p><strong>CC:</strong></p>
                                                    <ul>
                                                        {alert.cc ? (
                                                            <li className="text-black">{alert.cc}</li>
                                                        ) : (
                                                            <p className="text-black">No CC recipients</p>
                                                        )}
                                                    </ul>
                                                </div>

                                                <p><strong>Description:</strong> {alert.description}</p>

                                                <div className="flex gap-1">
                                                    <p><strong>Attachments:</strong></p>
                                                    {alert.attachments && alert.attachments.length > 0 ? (
                                                        <div className="flex overflow-x-scroll gap-4">
                                                            {alert.attachments.map((imgUrl, index) => (
                                                                <img
                                                                    key={index}
                                                                    src={imgUrl}
                                                                    alt={`Alert Image ${index + 1}`}
                                                                    className="w-10 h-10 rounded-md object-cover"
                                                                />
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <p>No image available</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )}
            
                                {editMode === alert.alertID && (
                                    <tr>
                                        <td colSpan="5" className="bg-gray20 p-4">
                                            <input
                                                type="text"
                                                name="alertName"
                                                value={editedAlert.alertName}
                                                onChange={handleInputChange}
                                                className="w-full p-2 sm:text-xs"
                                                style={{ fontSize: "14px", padding: ".2rem .35rem", borderRadius: "6px" }}
                                            />
                                            <textarea
                                                name="description"
                                                value={editedAlert.description}
                                                onChange={handleInputChange}
                                                className="w-full p-2 mt-2 rounded-[6px] text-[14px] py-[0.25rem] px-[0.35rem]"
                                            ></textarea>
                                            
                                            <div className="mt-4 flex gap-2 justify-end">
                                                <button
                                                    className="w-12 border bg-white text-black text-[12px] p-1 rounded-[6px] mt-0 border-gray20 hover-button"
                                                    onClick={() => setEditMode(null)}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="w-12 border bg-brand40 text-white text-[12px] p-1 rounded-[6px] mt-0 border-brand40 hover-button"
                                                    onClick={saveChanges}
                                                >
                                                    Save
                                                </button>
                                                
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            
                
            </div>
            <div className="flex gap-4 justify-between items-center mt-4">
                    <div>
                        <IconButton icon="previous" 
                        onClick={goToPreviousPage}
                        disabled={currentPage === 1} />
                    </div>
                    
                    <span className="text-gray60 text-[14px]">Page {currentPage} of {totalPages}</span>

                    <div>
                        <IconButton icon="next" 
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages} />
                    </div>
                </div>
        </div>
    );
};

export default AlertList;