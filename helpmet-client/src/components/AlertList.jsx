import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { IconButton } from "./ui/button";
import { useSelector } from "react-redux";
import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";


const AlertList = ({ alerts, companyID, fetchAlerts, onEditAlert }) => {
    const navigate = useNavigate();
    const [expandedAlertID, setExpandedAlertID] = useState(null);
    // const [editedAlert, setEditedAlert] = useState({ recipients: [], attachments: [] });
    const [allEmployees, setAllEmployees] = useState([]);
    const [allDepartments, setAllDepartments] = useState([]);
    const [editMode, setEditMode] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const senderEmail = useSelector((state) => state.user.email);
    const [intervals, setIntervals] = useState({});
    const [colSpan, setColSpan] = useState(window.innerWidth >= 768 ? 5 : 4);
    const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768);

    // Update colSpan and screen size status on resize
    useEffect(() => {
    const handleResize = () => {
        const isSmall = window.innerWidth < 768;
        setColSpan(isSmall ? 4 : 5);
        setIsSmallScreen(isSmall);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
    }, []);

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
    }, [companyID]);

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


    const editAlert = (alert) => {
        if (alert.type === "department") {
            navigate(`/alert/${alert.alertID}/department/edit`);
        } else {
            navigate(`/alert/${alert.alertID}/employee/edit`);
        }
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
                            <th className="py-2 font-bold" style={{ width: "15%" }}>Alert ID</th>
                            <th className="py-2 font-bold" style={{ width: "30%" }}>Alert Name</th>
                            <th className="py-2 font-bold" style={{ width: "18%" }}>Send Date</th>
                            <th className="py-2 font-bold hidden md:table-cell" style={{ width: "12%" }}>Recipients</th>
                            <th className="py-2 font-bold" style={{ width: "auto" }}></th>
                        </tr>
                    </thead>
                    <tbody className="text-[14px] text-center">
                        {getPaginatedAlerts().map((alert, index) => (
                            <React.Fragment key={alert.alertID}>
                                <tr className="border-t border-gray20 hover:bg-gray10">
                                    <td className="py-2 md:py-0">{ alert.alertID }</td>
                                    <td className="py-2 md:py-0">
                                        {isSmallScreen
                                            ? alert.alertName.length > 20
                                            ? `${alert.alertName.slice(0, 20)}...`
                                            : alert.alertName
                                        : alert.alertName}
                                    </td>
                                    <td className="py-2 md:py-0">{ alert.sentAt }</td>
                                    <td className="md:flex items-center h-12 relative hidden">
                                        {alert.recipients && JSON.parse(alert.recipients[0]).slice(0, 3).reverse().map((recipientID, idx) => {
                                            const id = recipientID;
                                            const employee = allEmployees.find(e => e.value === id);
                                            const label = employee ? employee.label : "Unknown";
                                            const nameInitial = label && label.includes(" - ") ? label.split(" - ")[1].charAt(0) : "?";
                                            return (
                                                <div 
                                                key={idx}
                                                className="relative" 
                                                style={{ 
                                                    zIndex: idx,
                                                    left: `${idx * 23}px`,
                                                    border: "1px solid white",
                                                    borderRadius: "50%",
                                                    width: "32px",
                                                    height: "32px",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    position: "absolute",
                                                    top: "50%",
                                                    transform: "translateY(-50%)", }}
                                                >
                                                    <Avatar 
                                                    name={nameInitial}
                                                    round={true}
                                                    size="30"
                                                    textSizeRatio={2.5} 
                                                    />
                                                </div>
                                            );
                                        })}
                                        {alert.recipients && JSON.parse(alert.recipients[0]).length > 3 && (
                                            <span className="text-gray60 absolute"
                                            style={{
                                              left: "82px",
                                              top: "50%",
                                              transform: "translateY(-50%)"
                                            }}>+{JSON.parse(alert.recipients[0]).length - 3}</span>
                                        )}
                                    </td>
                                    <td className="py-2 md:py-0">
                                        <div className="flex gap-2 justify-center items-center">
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
                                        <td colSpan={colSpan} className="px-3 py-2 lg:px-6 bg-gray20">
                                            <div className="whitespace-pre-wrap text-start">
                                                <p><strong>Alert Name:</strong> {alert.alertName}</p>
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
                                            </div>

                                            {/* CC Recipients Card */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="text-gray-500 mb-2">CC Recipients</div>
                                                <div className="font-medium text-gray-900">
                                                {alert.cc ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-white border border-gray-200">
                                                    {alert.cc}
                                                    </span>
                                                ) : (
                                                    <span className="text-gray-500 italic">No CC recipients</span>
                                                )}
                                                </div>
                                            </div>

                                            {/* Description Card - Full Width */}
                                            <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                                                <div className="text-gray-500 mb-2">Description</div>
                                                <div className="font-medium text-gray-900">
                                                {alert.description || <span className="text-gray-500 italic">No description available</span>}
                                                </div>
                                            </div>

                                            {/* Attachments Card - Full Width */}
                                            <div className="bg-gray-50 rounded-lg p-4 md:col-span-2">
                                                <div className="text-gray-500 mb-2">Attachments</div>
                                                <div className="font-medium text-gray-900">
                                                {alert.attachments && alert.attachments.length > 0 ? (
                                                    <div className="flex gap-3 overflow-x-auto py-2">
                                                    {alert.attachments.map((imgUrl, index) => (
                                                        <div key={index} className="flex-shrink-0">
                                                        <img
                                                            src={imgUrl}
                                                            alt={`Alert Image ${index + 1}`}
                                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                                        />
                                                        </div>
                                                    ) : (
                                                        <p>No attachments</p>
                                                    )}
                                                </div>
                                            </div>
                                            </div>
                                        </div>
                                        </td>
                                    </tr>
                                    )}
            
                                {/* {editMode === alert.alertID && (
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
                                )} */}
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