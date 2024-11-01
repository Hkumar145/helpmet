import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import { useSelector } from "react-redux";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";


import axios from "../api/axios";

const CreateEmployeeAlert = ({ companyID, fetchAlerts, onCancel }) => {
    const [alertData, setAlertData] = useState({ 
        alertName: "", 
        description: "", 
        recipients: [], 
        cc: [],
        attachments: [] 
    });
    const [recipients, setRecipients] = useState([]);
    const [scheduleDate, setScheduleDate] = useState(null);
    const [loadingRecipients, setLoadingRecipients] = useState(false);
    const senderEmail = useSelector((state) => state.user.email);
    const [dateTime, setDateTime] = useState(new Date());
    const [selectedRecipients, setSelectedRecipients] = useState([]);

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
        setAlertData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRecipientsChange = (selectedOptions) => {
        const newRecipients = selectedOptions.map((option) => option.value);
        // Add only the new recipients that haven't been selected before
        setAlertData((prev) => ({
            ...prev,
            recipients: [...new Set([...prev.recipients, ...newRecipients])],
        }));
        // Update selectedRecipients with unique values to display outside
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
        const ccEmails = e.target.value
            .split(",")
            .map(email => email.trim())
            .filter(email => email !== "");

        setAlertData((prev) => ({
            ...prev,
            cc: ccEmails,
        }));
    };

    // Use react-dropzone to upload files
    const onDrop = useCallback((acceptedFiles) => {
        setAlertData((prevData) => ({
            ...prevData,
            attachments: [...prevData.attachments, ...acceptedFiles],
        }));
    }, []);
    

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    // Remove attachments
    const removeFile = (file) => {
        setAlertData((prevData) => ({
            ...prevData,
            attachments: prevData.attachments.filter((f) => f !== file),
        }));
    };

    const createAlert = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("alertName", alertData.alertName);
        formData.append("description", alertData.description);
        formData.append("companyID", companyID);
        formData.append("scheduleTime", scheduleDate ? scheduleDate.toISOString() : null);
        formData.append("recipients", JSON.stringify(alertData.recipients));
        formData.append("cc", JSON.stringify(alertData.cc));

        if (alertData.attachments.length > 0) {
            alertData.attachments.forEach((file) => {
              formData.append("attachments", file);
            });
        }

        try {
            await axios.post(`/companies/${companyID}/alerts`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            /// Fetch all employees to get their emails by employee ID
            const response = await axios.get(`/companies/${companyID}/employees`);
            const allEmployees = response.data;
            const recipientEmails = allEmployees
                .filter((employee) => alertData.recipients.includes(employee.employeeID))
                .map((employee) => employee.email);

            if (!recipientEmails || recipientEmails.length === 0) {
                throw new Error("No valid recipient emails found.");
            }

            await axios.post("/email/send-alert-email", {
                recipients: recipientEmails,
                senderEmail,
                alertDetails: {
                    alertName: alertData.alertName,
                    description: alertData.description,
                },
                cc: alertData.cc,
                // attachments: alertData.attachments
            });
            alert("Alert created successfully!");
            fetchAlerts();
            onCancel();
        } catch (error) {
            // console.error("Error creating employee alert:", error);
            if (error.response) {
                // Log the full error response data
                console.error("Error creating employee alert:", error.response.data);
            } else {
                console.error("Error creating employee alert:", error.message);
            }
        }
    };

    return (
        <div>
            <form onSubmit={createAlert} className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-4">
                <div className="col-span-2 lg:col-span-1 flex flex-col gap-2">
                    <label className="text-sm lg:text-lg transition-all duration-300">Alert Name</label>
                    <input type="text" name="alertName" value={alertData.alertName} onChange={handleInputChange} />

                    <label className="text-sm lg:text-lg transition-all duration-300">Note</label>
                    <textarea name="description" value={alertData.description} onChange={handleInputChange} className="h-40"/>

                    <div {...getRootProps({ className: "flex flex-row item-center justify-between gap-2 border mt-4 p-2 bg-white rounded-md" })}>
                        <label className="mt-0 text-black text-sm lg:text-lg transition-all duration-300">Attachments</label>
                        <input {...getInputProps()} />
                        <p className="cursor-pointer text-gray-600 content-center text-xs lg:text-sm transition-all duration-300">
                            <span className="text-purple-400">Click here to upload</span> or drag and drop files
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
                            <ul>
                                {alertData.attachments.map((file, index) => (
                                    <li key={index} className="flex justify-between items-center p-2">
                                        <span>{file.name}</span>
                                        <button onClick={() => removeFile(file)} className="text-sm text-red-400 hover:text-red-600 mt-0 p-0">Remove</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="col-span-2 lg:col-span-1 flex flex-col gap-2">
                    <div className="flex flex-col gap-2">
                        <label className="text-sm lg:text-lg transition-all duration-300">CC</label>
                        <input
                            type="text"
                            name="cc"
                            placeholder="name@helpmet.com"
                            value={alertData.cc.join(", ")}
                            onChange={handleCCChange}
                            className="bg-white"
                        />
                    </div>
  
                    <div className="flex flex-col gap-2">
                        <label className="text-sm lg:text-lg transition-all duration-300 lg:mt-4">Recipients</label>
                        <Select
                            options={recipients}
                            onChange={handleRecipientsChange}
                            value={[]}
                            isLoading={loadingRecipients}
                            placeholder="Select Recipients"
                            isSearchable={true}
                            isMulti={true}
                        />
                        <div className={`bg-white p-1 rounded-md ${selectedRecipients.length > 3 ? "h-24 overflow-y-auto" : "h-auto"}`}>
                            {selectedRecipients.length > 0 ? (
                                <ul>
                                {selectedRecipients.map((recipient) => (
                                    <li key={recipient.value} className="flex items-center justify-between p-1">
                                        <span>{recipient.label}</span>
                                        <button
                                            type="button"
                                            className="mt-0 p-0 text-red-500 text-xs hover:underline lg:text-sm transition-all duration-300"
                                            onClick={() => handleRecipientSelection(recipient)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            ) : (
                                <p className="text-gray-400 text-xs p-1 lg:text-sm">No employees selected.</p>
                            )}
                        </div> 
                    </div>
                     
                    
                    <div className="flex flex-col gap-2">
                        <label>Schedule Alert (optional)</label>
                        <DateTimePicker
                            onChange={setDateTime}   
                            value={dateTime}         
                            clearIcon={null}         
                            calendarIcon={null}     
                            disableClock={false} 
                            isCalendarOpen={false}
                            isClockOpen={false} 
                        />
                    </div>
                    

                    <div className="flex flex-row justify-end gap-2">
                        <button className="bg-purple-300 text-black text-sm p-2 mt-0 rounded-lg text-center hover:bg-indigo-700 hover:text-white max-w-40" type="submit">Submit</button>
                        <button className="bg-purple-300 text-black text-sm p-2 mt-0 rounded-lg text-center hover:bg-indigo-700 hover:text-white max-w-40" type="button" onClick={onCancel}>Cancel</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateEmployeeAlert;
