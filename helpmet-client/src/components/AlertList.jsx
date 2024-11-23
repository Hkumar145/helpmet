import React, { useState, useEffect } from "react";
import axios from "../api/axios";
import { IconButton } from "./ui/button";
import { useSelector } from "react-redux";
import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';


const AlertList = ({ alerts, companyID, fetchAlerts }) => {
    const navigate = useNavigate();
    const [expandedAlertID, setExpandedAlertID] = useState(null);
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
                toast.success("Alert activated successfully! Alert will be sent every 7 days.", {
                    autoClose: 3000,
                    className: "custom-toast",
                    bodyClassName: "custom-toast-body",
                });
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
                }, 7 * 24 * 60 * 60 * 1000); // Repeat sending alert in 7 days

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
                toast.success("Alert deactivated successfully!", {
                    autoClose: 3000,
                    className: "custom-toast",
                    bodyClassName: "custom-toast-body",
                });
                console.log(`Cleared interval for alert ID: ${alertID}`);
            }
            
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };
    
    return (
        <div className="flex flex-col items-center justify-center">
            <ToastContainer position="top-right" />
            <div className="w-full overflow-x-auto rounded-lg shadow-md">
                <table className="bg-white p-6 w-full text-left table-fixed min-w-[500px]">
                    <thead className="text-center">
                        <tr className="text-gray50 bg-[#f8f8f8]">
                            <th className="py-4 font-bold" style={{ width: window.innerWidth >= 1024 ? "20%" : "15%" }}>Alert ID</th>
                            <th className="py-4 font-bold text-left" style={{ width: "30%" }}>Alert Name</th>
                            <th className="py-4 font-bold" style={{ width: "18%" }}>Send Date</th>
                            <th className="py-4 font-bold text-left hidden md:table-cell" style={{ width: "12%" }}>Recipients</th>
                            <th className="py-4 font-bold" style={{ width: "auto" }}></th>
                        </tr>
                    </thead>
                    <tbody className="text-center">
                        {getPaginatedAlerts().map((alert, index) => (
                            <React.Fragment key={alert.alertID}>
                                <tr className="border-t border-gray20 hover:bg-gray10">
                                    <td className="py-2 md:py-0">{ alert.alertID }</td>
                                    <td className="py-2 md:py-0 text-left">
                                        {isSmallScreen
                                            ? alert.alertName.length > 20
                                                ? `${alert.alertName.slice(0, 20)}...`
                                                : alert.alertName
                                            : alert.alertName}
                                    </td>
                                    <td className="py-2 md:py-0">{ alert.sentAt }</td>
                                    <td className="md:flex items-center h-12 text-left relative hidden">
                                        {alert.recipients && JSON.parse(alert.recipients[0] || "[]").slice(0, 3).reverse().map((recipientID, idx) => {
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
                                                        transform: "translateY(-50%)", 
                                                    }}
                                                >
                                                    <Avatar 
                                                        name={nameInitial}
                                                        round={true}
                                                        size="30"
                                                        textSizeRatio={2} 
                                                    />
                                                </div>
                                            );
                                        })}
                                        {alert.recipients && JSON.parse(alert.recipients[0] || "[]").length > 3 && (
                                            <span className="text-gray60 absolute"
                                                style={{
                                                    left: "82px",
                                                    top: "50%",
                                                    transform: "translateY(-50%)"
                                                }}>
                                                +{JSON.parse(alert.recipients[0]).length - 3}
                                            </span>
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
                                                    className={`icon-button ${expandedAlertID === alert.alertID ? "selected" : ""}`}
                                                />
                                            </div>
                                            <div>
                                                <IconButton icon="edit" 
                                                    onClick={() => editAlert(alert)}
                                                    className={`icon-button ${editMode === alert.alertID ? "selected" : ""}`} 
                                                />
                                            </div>
                                        </div>
                                    </td>
                                </tr>

                                {expandedAlertID === alert.alertID && (
                                    <tr>
                                        <td colSpan={colSpan} className="px-6 py-4">
                                        <div className="bg-white rounded-lg">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            {/* Recipients Card */}
                                            <div className="bg-gray-50 rounded-lg p-4 text-left">
                                                <div className="text-gray-500 text-sm">Recipients</div>
                                                <div className="font-medium text-gray-900 text-[16px]">
                                                {alert.recipients && alert.recipients.length > 0 ? (
                                                    <div className="flex flex-wrap items-center justify-start gap-[0.15rem]">
                                                    {alert.recipients.map((recipientID, idx) => {
                                                        const ids = recipientID[0] === "[" ? JSON.parse(recipientID) : [recipientID];
                                                        return ids.map((id, idIdx) => {
                                                        let employee = allEmployees.find(e => e.value === id) || 
                                                                    allDepartments.find(e => e.value === id);
                                                        return (
                                                            <span 
                                                            key={`${idx}-${idIdx}`}
                                                            className="inline-flex items-center px-2.5 py-1 rounded-full bg-white border border-gray-200"
                                                            >
                                                            {employee ? employee.label : "Unknown recipient"}
                                                            </span>
                                                        );
                                                        });
                                                    })}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 italic text-[16px]">No recipients</span>
                                                )}
                                                </div>
                                            </div>

                                            {/* CC Recipients Card */}
                                            <div className="bg-gray-50 rounded-lg p-4 text-left">
                                                <div className="text-gray-500 text-sm">CC Recipients</div>
                                                <div className="font-medium text-gray-900 text-[16px]">
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
                                            <div className="bg-gray-50 rounded-lg p-4 md:col-span-2 text-left">
                                                <div className="text-gray-500 text-sm">Description</div>
                                                <div className="font-medium text-gray-900 text-[16px]">
                                                {alert.description || <span className="text-gray-500 italic">No description available</span>}
                                                </div>
                                            </div>

                                            {/* Attachments Card - Full Width */}
                                            <div className="bg-gray-50 rounded-lg p-4 md:col-span-2 text-left">
                                                <div className="text-gray-500 text-sm">Attachments</div>
                                                <div className="font-medium text-gray-900 text-[16px]">
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
                                                    ))}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-500 italic">No attachments available</span>
                                                )}
                                                </div>
                                            </div>
                                            </div>
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
                        disabled={currentPage === 1} 
                    />
                </div>
                <span className="text-gray60 text-[14px]">Page {currentPage} of {totalPages}</span>
                <div>
                    <IconButton icon="next" 
                        onClick={goToNextPage}
                        disabled={currentPage === totalPages} 
                    />
                </div>
            </div>
        </div>
    );
};

export default AlertList;