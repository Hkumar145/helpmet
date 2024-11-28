import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import { IconButton } from "./ui/button";
import CustomSelect from "./ui/select";
import Avatar from "react-avatar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const MAX_NOTE_LENGTH = 300;

const CreateDepartmentAlert = ({ companyID, fetchAlerts, onCancel }) => {
    const [alertData, setAlertData] = useState({ 
        alertName: "", 
        description: "", 
        recipients: [], 
        cc: "",
        attachments: [] 
    });

    const [departmentOptions, setDepartmentOptions] = useState([]);
    const senderEmail = useSelector((state) => state.user.email);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [employees, setEmployees] = useState([]);
    const [allSelectedEmployees, setAllSelectedEmployees] = useState([]); 

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get(`/companies/${companyID}/departments`);
                const departmentOptions = response.data.map((department) => ({
                    value: department.departmentID,
                    label: `${department.departmentName}`,
                }));
                setDepartmentOptions(departmentOptions);
            } catch (error) {
                console.error("Error fetching departments:", error);
            }
        };
        fetchDepartments();
   
    }, [companyID]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === "description" && value.length > MAX_NOTE_LENGTH) {
            return;
        }
        setAlertData((prev) => ({ ...prev, [name]: value }));
    };

    // Fetch employees for the selected department
    const handleDepartmentChange = async (selectedOption) => {
        try {
            const { data } = await axios.get(`/companies/${companyID}/departments/${selectedOption.value}/employees`);
            setEmployees(data);
            setFilteredEmployees(data);
        } catch (error) {
            console.error("Error fetching employees:", error);
        }
    };

    // Search employees with ID or name
    const handleSearch = (e) => {
        const term = e.target.value.toLowerCase();
        setSearchTerm(term);
    
        const sortedEmployees = employees
            .filter(emp => 
                emp.employeeID.toString().toLowerCase().includes(term) || 
                (`${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term))
            )
            .sort((a, b) => {
                const aRelevance = (`${a.employeeID} ${a.firstName} ${a.lastName}`).toLowerCase().startsWith(term) ? -1 : 0;
                const bRelevance = (`${b.employeeID} ${b.firstName} ${b.lastName}`).toLowerCase().startsWith(term) ? -1 : 0;
                return aRelevance - bRelevance;
            });
    
        setFilteredEmployees(sortedEmployees);
    };
    
    // Store and display selected recipients
    const handleRecipientSelection = (employee) => {
        const isSelected = alertData.recipients.includes(employee.employeeID);
        
        setAlertData(prevData => ({
            ...prevData,
            recipients: isSelected 
                ? prevData.recipients.filter(id => id !== employee.employeeID)
                : [...prevData.recipients, employee.employeeID],
        }));

        setAllSelectedEmployees(prevSelected => {
            return isSelected 
                ? prevSelected.filter(emp => emp.employeeID !== employee.employeeID)
                : [...prevSelected, employee];
        });
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
        setAlertData((prevData) => ({
            ...prevData,
            attachments: prevData.attachments.filter((f) => f !== file),
        }));
    };

    // Create new alert
    const createAlert = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("alertName", alertData.alertName);
        formData.append("description", alertData.description);
        formData.append("recipients", JSON.stringify(alertData.recipients));
        formData.append("cc", alertData.cc);
        formData.append("type", "department");
    
        if (alertData.attachments.length > 0) {
          alertData.attachments.forEach((file) => {
            formData.append("attachments", file);
          });
        }

        try {
            const create_response = await axios.post(`/companies/${companyID}/alerts`, formData);
            toast.success("Alert created successfully!", {
                autoClose: 3000,
                className: "custom-toast",
                bodyClassName: "custom-toast-body",
              });
            alertData.attachments = create_response.data.attachments;

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
                attachments: alertData.attachments
            });
            setTimeout(() => {
                fetchAlerts();
                onCancel();
            }, 1500);
        } catch (error) {
            toast.error(`Failed to create department alert. ${error}`, {
                autoClose: 3000,
                className: "custom-toast-error",
                bodyClassName: "custom-toast-body",
            });
        }
    };

    const demoAutoFill = () => {
        setAlertData((prevState) => ({
            ...prevState,
            alertName: "Emergency Exit – Keep Path Clear",
            description: "Please ensure that all pathways to emergency exits are free of obstacles. In the event of an emergency, quick and safe access is critical for everyone's safety.",
            cc: "helpmetca@gmail.com"
        }));
    };

    return (
        <div className="w-full overflow-x-auto">
            <ToastContainer position="top-right" />
            <form onSubmit={createAlert} className="flex flex-col gap-2 lg:grid lg:grid-cols-2 lg:gap-4 items-start min-w-[500px]">
                <div className="col-span-2 lg:col-span-1 flex flex-col gap-3 border p-4 border-gray20 bg-white rounded-[10px] w-full">
                    <div className="flex flex-col gap-1">
                        <label className="text-gray60 text-[16px] mt-0" onClick={demoAutoFill}>Alert Name</label>
                        <input type="text" className="bg-gray10 border border-gray20" style={{ fontSize: "14px", padding: ".3rem .35rem", borderRadius: "8px" }} name="alertName" value={alertData.alertName} onChange={handleInputChange} />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        <label className="text-gray60 text-[16px] mt-0">Note</label>
                        <textarea name="description" maxLength={MAX_NOTE_LENGTH} value={alertData.description} onChange={handleInputChange} className="text-[14px] px-2 py-1 h-[200px] bg-gray10 border border-gray20 rounded-[8px]"/>
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
                                        <span className="text-[16px]">{file.name}</span>
                                        <div>
                                            <IconButton icon="close" 
                                            onClick={() => removeFile(file)}
                                            className="no-border p-1" 
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
                        <div className={`bg-gray10 border rounded-[8px] border-gray20 ${allSelectedEmployees.length > 3 ? "h-32 overflow-y-auto" : "h-auto"}`}>
                            {allSelectedEmployees.length > 0 ? (
                                <ul>
                                    {allSelectedEmployees.map((emp) => (
                                        <li key={emp.employeeID} className="flex items-center justify-between px-2 py-1 text-[14px]">
                                            <div className="flex gap-2 items-center">
                                                <Avatar
                                                name={emp.firstName}
                                                round={true}
                                                size="35"
                                                textSizeRatio={2.5}
                                                />
                                                <span>{emp.employeeID} - {emp.firstName} {emp.lastName}</span>
                                            </div>
                                            <div>
                                                <IconButton icon="close" 
                                                onClick={() => handleRecipientSelection(emp)}
                                                className="no-border p-1"
                                                style={{
                                                    backgroundColor: "transparent",
                                                }} />
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray30 text-[14px] px-2 py-[7px]">No employees selected.</p>
                            )}
                        </div>          

                        <div className="bg-white p-2 flex flex-col gap-2 border border-gray20 rounded-[10px] mt-1">
                            <h3 className="text-gray60 text-center text-[16px] font-bold">Members</h3>
                            <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    placeholder="Search Employee"
                                    className={`w-28 lg:w-40 border border-gray20 placeholder-text ${employees.length === 0 ? "bg-gray10 text-gray40" : "bg-white"}`}
                                    disabled={employees.length === 0}
                                    style={{ fontSize: "14px", padding: ".2rem .35rem", borderRadius: "8px" }}
                                />
                                <CustomSelect
                                    options={departmentOptions}
                                    onChange={handleDepartmentChange}
                                    alignRight={true}
                                    placeholder="Select Department"
                                    isSearchable={true}
                                />
                            </div>
                            <ul className={`space-y-2 overflow-y-scroll ${employees.length > 0 ? "h-48" : "h-auto"}`}>
                                {filteredEmployees.map(emp => {
                                    const isSelected = alertData.recipients.includes(emp.employeeID);
                                    return (
                                        <li key={emp.employeeID} onClick={() => handleRecipientSelection(emp)} 
                                            className={`flex items-center justify-between p-1 pl-2 rounded-md border text-[14px]
                                                ${isSelected ? "bg-secondary20" : "bg-secondary10"}`}>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    onClick={(e) => e.stopPropagation()}
                                                    checked={alertData.recipients.includes(emp.employeeID)}
                                                    onChange={() => handleRecipientSelection(emp)}
                                                    className="custom-checkbox"
                                                />
                                                <span className="font-medium">{emp.employeeID}</span>
                                                <span className="">{emp.firstName} {emp.lastName}</span>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                
                    <div className="flex flex-row justify-end gap-2">
                        <button className="bg-white text-gray30 hover:text-gray40 text-[16px] px-4 m-0 rounded-[6px] text-center border border-gray20" type="button" onClick={onCancel}>Cancel</button>
                        <button className="bg-brand40 text-white text-[16px] px-4 m-0 rounded-[6px] text-center border border-brand50 hover-button" type="submit">Submit</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default CreateDepartmentAlert;
