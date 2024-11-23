import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import CustomSelect from "./ui/select";
import { useSelector } from "react-redux";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import axios from "../api/axios";
import "../index.css";
import { IconButton } from "./ui/button";
import Avatar from "react-avatar";
import {useNavigate, useParams} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_NOTE_LENGTH = 300;

const EditEmployeeAlert = () => {
    const navigate = useNavigate();
    const [alertData, setAlertData] = useState({ 
        alertName: "", 
        description: "", 
        recipients: [], 
        cc: "",
        attachments: [] 
    });
    const companyID = useSelector((state) => state.user.currentUser?.companyID);
    const { alertId } = useParams();
    const [recipients, setRecipients] = useState([]);
    const [loadingRecipients, setLoadingRecipients] = useState(false);
    const [dateTime, setDateTime] = useState(null);
    const [selectedRecipients, setSelectedRecipients] = useState([]);
    const [removedAttachments, setRemovedAttachments] = useState([]);

    const onCancel = () => {
        navigate(-1);
    }

    // Set selected recipients by parsing each recipient ID
    const fetchRecipientDetails = async (recipientIDs) => {
        const details = await Promise.all(
            recipientIDs.map(async (recipient) => {
                const ids = recipient.startsWith("[") ? JSON.parse(recipient) : [recipient];

                // Fetch employee details for each ID in parsed `ids`
                const employees = await Promise.all(ids.map(async (id) => {
                    try {
                        const response = await axios.get(`/employees/${id}`);
                        const employee = response.data;
                        return {
                            value: employee.employeeID,
                            label: `${employee.employeeID} - ${employee.firstName} ${employee.lastName}`
                        };
                    } catch (error) {
                        console.error(`Error fetching details for employee ID ${id}:`, error);
                        return { value: id, label: "Unknown recipient" };
                    }
                }));
                return employees;
            })
        );
        // Flatten the array and set selected recipients
        setSelectedRecipients(details.flat());
    };

    useEffect(() => {
        axios.get(`/alerts/${alertId}`)
            .then(async res => {
                let data = res.data;
                const recipient_str = data.recipients;
                data.recipients = JSON.parse(data.recipients[0]);
                setAlertData({
                    ...data,
                    attachments: data.attachments.map(item => {
                        return item.split("/").pop();
                    })
                });
            await fetchRecipientDetails(recipient_str);
            setDateTime(new Date(data.sentAt));
            }).catch(error => {
            console.error("Error fetching alert:", error);
        })
    }, [alertId]);

    useEffect(() => {
        // Fetch all employees
        const fetchRecipients = async () => {
            setLoadingRecipients(true);
            try {
                const response = await axios.get(`/companies/${companyID}/employees`);
                const employeeOptions = response.data.map((employee) => ({
                    value: employee.employeeID,
                    label: `${employee.employeeID} - ${employee.firstName} ${employee.lastName}`,
                }));
                setRecipients(employeeOptions);
            } catch (error) {
                console.error("Error fetching recipients:", error);
            }
            setLoadingRecipients(false);
        };
        fetchRecipients();
    }, [companyID]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "description" && value.length > MAX_NOTE_LENGTH) {
            return;
        }
        setAlertData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRecipientsChange = (selectedOptions) => {
        const newRecipients = selectedOptions.map((option) => option.value);
        if (!alertData.recipients.includes(newRecipients[0])) {
            setAlertData((prev) => ({
                ...prev,
                recipients: [...prev.recipients, newRecipients[0]],
            }));
        }

        setSelectedRecipients((prevSelected) => {
            const allSelected = [...prevSelected, ...selectedOptions];
            const uniqueSelected = Array.from(new Set(allSelected.map((r) => r.value)))
                .map((id) => allSelected.find((r) => r.value === id));
            return uniqueSelected;
        });
    };

    const handleRecipientSelection = (recipient) => {
        // Remove the selected recipient from both alertData.recipients and selectedRecipients
        setAlertData((prev) => ({
            ...prev,
            recipients: prev.recipients.filter((id) => id !== recipient.value),
        }));
        setSelectedRecipients((prevSelected) => prevSelected.filter((r) => r.value !== recipient.value));
    }; 

    const handleCCChange = (e) => {
        const email = e.target.value.trim();
        setAlertData((prev) => ({
            ...prev,
            cc: email,
        }));
    };

    const validateEmailFormat = () => {
        const { cc } = alertData;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (cc && !emailRegex.test(cc)) {
            console.error("Invalid email format");
            setAlertData((prev) => ({ ...prev, cc: "" }));
            alert("Please enter a valid email format for CC.");
        }
    };

    // Use react-dropzone to upload files
    const onDrop = useCallback((acceptedFiles) => {
        setAlertData((prevData) => ({
            ...prevData,
            attachments: [...prevData.attachments, ...acceptedFiles],
        }));
    }, []);
    
    const { getRootProps, getInputProps } = useDropzone({ 
        onDrop,
        accept: "image/*", 
    });

    // Remove attachments
    const removeFile = (file) => {
        setRemovedAttachments((prev) => [...prev, file]);
        setAlertData((prevData) => ({
            ...prevData,
            attachments: prevData.attachments.filter((f) => f !== file),
        }));
    };

    const handleDateTimeChange = (value) => {
        console.log(value)
        const now = new Date();
        if (value == null) {
            setDateTime(now);
        } else {
            setDateTime(value);
        }
    };

    const updateAlert = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("alertName", alertData.alertName);
        formData.append("description", alertData.description);
        formData.append("companyID", companyID);
        formData.append("scheduleTime", dateTime ? dateTime.toISOString() : new Date().toISOString());
        formData.append("recipients", JSON.stringify(alertData.recipients));
        if (alertData.cc && alertData.cc.trim() !== "") {
            formData.append("cc", alertData.cc);
        }
        formData.append("removedAttachments", JSON.stringify(removedAttachments));
        let oldAttachments = [];
        if (alertData.attachments.length > 0) {
            alertData.attachments.filter(item => {
                return typeof item === "string";
            }).forEach((url) => {
                oldAttachments.push(url);
            });
            formData.append("oldAttachments", JSON.stringify(oldAttachments));

            alertData.attachments.filter(item => {
                return typeof item !== "string";
            }).forEach((file) => {
                formData.append("attachments", file);
            });
        }
    
        try {
            await axios.put(`/alerts/${alertId}`, formData);
            toast.success("Alert updated successfully!", {
                autoClose: 3000,
                className: "custom-toast",
                bodyClassName: "custom-toast-body",
            });
            setTimeout(() => {
                navigate(-1);
            }, 1500);
            return;
        } catch (error) {
            toast.error(`Failed to update employee alert. ${error}`, {
                autoClose: 3000,
                className: "custom-toast-error",
                bodyClassName: "custom-toast-body",
            });
        }
    };
 
    return (
        <div className="flex flex-col gap-4 w-full px-4 lg:px-7 py-0 max-w-[2700px]">
            <ToastContainer position="top-right" />
            <h1 className="text-black text-[32px] font-bold">Update Alert</h1>
            <form onSubmit={updateAlert} className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-4 items-start">
                <div className="col-span-2 lg:col-span-1 flex flex-col gap-3 border p-4 border-gray20 bg-white rounded-[10px] w-full">
                    <div className="flex flex-col gap-1">
                        <label className="text-gray60 text-[16px] mt-0">Alert Name</label>
                        <input type="text" className="bg-gray10 border border-gray20" style={{ fontSize: "14px", padding: ".3rem .35rem", borderRadius: "8px" }} name="alertName" value={alertData.alertName} onChange={handleInputChange} />
                    </div>

                    <div className="flex flex-col gap-1">
                        <label className="text-gray60 text-[16px] mt-0">Note</label>
                        <textarea name="description" value={alertData.description} onChange={handleInputChange} maxLength={MAX_NOTE_LENGTH} className="text-[14px] px-2 py-1 h-[200px] bg-gray10 border border-gray20 rounded-[8px]"/>
                        <span className="text-gray30 text-xs">{MAX_NOTE_LENGTH - alertData.description.length} characters left</span>
                    </div>

                    <div {...getRootProps({ className: "flex flex-row item-center justify-between gap-2 border border-gray20 mt-0 px-2 py-1 bg-gray10 rounded-[8px]" })}>
                        <label className="mt-0 text-gray60 text-[16px]">Attachments</label>
                        <input {...getInputProps()} />
                        <p className="cursor-pointer text-gray40 content-center text-[14px]">
                            <span className="text-brand40">Click here to upload</span> or drag and drop files
                        </p>
                    </div>

                    <div className={`rounded-md bg-white ${alertData.attachments.length > 3 ? "h-28 overflow-y-auto" : "overflow-hidden"}`}
                        style={{
                            height: alertData.attachments.length === 0
                                ? "0"
                                : alertData.attachments.length <= 3
                                ? "auto"
                                : "7rem"
                        }}>
                        {alertData.attachments.length > 0 && (
                            <ul className="border rounded-[10px] border-black mt-2">
                                {alertData.attachments.map((file, index) => (
                                    <li key={index} className="flex justify-between items-center p-2 text-[14px]">
                                        <span>{typeof file === "string" ? file : file.name}</span>
                                        <div>
                                            <IconButton 
                                            type={"button"} 
                                            icon="close"
                                            onClick={() => removeFile(file)}
                                            className="no-border" 
                                            style={{
                                                backgroundColor: "transparent",
                                            }} />
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="col-span-2 lg:col-span-1 flex flex-col gap-3 w-full">
                <div className="flex flex-col gap-1">
                    <label className="text-gray60 text-[16px]">CC</label>
                    <input
                        type="text"
                        name="cc"
                        placeholder="name@helpmet.com"
                        value={alertData.cc || ""}
                        onChange={handleCCChange}
                        onBlur={validateEmailFormat}
                        className="bg-gray10 border border-gray20 placeholder-text"
                        style={{ fontSize: "14px", padding: ".3rem .45rem", borderRadius: "8px" }}
                    />
                </div>
  
                    <div className="flex flex-col gap-1 p-0.5">
                        <label className="text-gray60 text-[16px] mt-0">To</label>
                        <CustomSelect
                            options={recipients}
                            onChange={handleRecipientsChange}
                            value={[]}
                            minDate={new Date()}
                            isLoading={loadingRecipients}
                            placeholder="Select Recipients"
                            isSearchable={true}
                            isMulti={true}
                        />
                        <div className={`bg-gray10 border rounded-[8px] border-gray20 ${selectedRecipients.length > 3 ? "h-32 overflow-y-auto" : "h-auto"}`}>
                            {selectedRecipients.length > 0 ? (
                                <ul>
                                {selectedRecipients.map((recipient) => (
                                    <li key={recipient.value} className="flex items-center justify-between px-2 py-1 text-[14px]">
                                        <div className="flex gap-2 items-center">
                                            <Avatar
                                            name={recipient.label.split(" - ")[1].charAt(0)}
                                            round={true}
                                            size="35"
                                            textSizeRatio={2.5}
                                            />
                                            <span>{recipient.label}</span>
                                        </div>
                                        <div>
                                            <IconButton icon="close" 
                                            onClick={() => handleRecipientSelection(recipient)}
                                            className="no-border p-1" 
                                            style={{
                                                backgroundColor: "transparent",
                                            }} />
                                        </div>
                                    </li>
                                    
                                ))}
                            </ul>
                            ) : (
                                <p className="text-gray30 text-[14px] px-2 py-[7px]">No recipients selected.</p>
                            )}
                        </div> 
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-gray60 text-[16px] mt-0">Schedule Alert</label>
                        <DateTimePicker
                            onChange={handleDateTimeChange}   
                            value={dateTime}         
                            clearIcon={null}         
                            calendarIcon={null}  
                            minDate={new Date()}   
                            disableClock={false} 
                            isCalendarOpen={false}
                            isClockOpen={false} 
                        />
                    </div>

                    <div className="flex flex-row justify-end gap-2">
                        <button className="bg-white text-gray30 hover:text-gray40 text-[16px] px-4 m-0 rounded-[6px] text-center border border-gray20" type="button" onClick={onCancel}>Cancel</button>
                        <button className="bg-brand40 text-white text-[16px] px-4 m-0 rounded-[6px] text-center border border-brand50 hover-button" type="submit">Save Changes</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default EditEmployeeAlert;
