import React, { useState, useEffect, useCallback } from "react";
import Select from "react-select";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import axios from "../api/axios";

const CreateDepartmentAlert = ({ companyID, fetchAlerts, onCancel }) => {
    const [alertData, setAlertData] = useState({ 
        alertName: "", 
        description: "", 
        recipients: [], 
        cc: [],
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
        const ccEmails = e.target.value
            .split(",")
            .map(email => email.trim())
            .filter(email => email !== "");

        setAlertData((prev) => ({
            ...prev,
            cc: ccEmails,
        }));
    };

    const onDrop = useCallback((acceptedFiles) => {
        setAlertData((prevData) => ({
            ...prevData,
            attachments: [...prevData.attachments, ...acceptedFiles],
        }));
    }, []);
    
    const { getRootProps, getInputProps } = useDropzone({ onDrop });
    
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
        formData.append("cc", JSON.stringify(alertData.cc));
    
        if (alertData.attachments.length > 0) {
          alertData.attachments.forEach((file) => {
            formData.append("attachments", file);
          });
        }

        try {
            await axios.post(`/companies/${companyID}/alerts`, formData);

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
            console.error("Error creating department alert:", error);
        }
    };

    return (
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
                    <div className={`bg-white p-1 rounded-md ${allSelectedEmployees.length > 3 ? "h-24 overflow-y-auto" : "h-auto"}`}>
                        {allSelectedEmployees.length > 0 ? (
                            <ul>
                                {allSelectedEmployees.map((emp) => (
                                    <li key={emp.employeeID} className="flex items-center justify-between p-1">
                                        <span>{emp.employeeID} - {emp.firstName} {emp.lastName}</span>
                                        <button
                                            type="button"
                                            className="mt-0 p-0 text-red-500 text-xs hover:underline lg:text-sm transition-all duration-300"
                                            onClick={() => handleRecipientSelection(emp)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-400 text-xs p-1 lg:text-sm transition-all duration-300">No employees selected.</p>
                        )}
                    </div>          

                    <div className="bg-white rounded-lg p-2 flex flex-col gap-2">
                        <h3 className="text-center text-sm lg:text-lg transition-all duration-300">Members</h3>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs lg:text-sm transition-all duration-300">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={handleSearch}
                                placeholder="Search Employee"
                                className={`p-2 pl-8 w-40 border border-gray-300 rounded ${employees.length === 0 ? "bg-gray-200 text-gray-500" : "bg-white"}`}
                                disabled={employees.length === 0}
                            />
                            <Select
                                options={departmentOptions}
                                onChange={handleDepartmentChange}
                                placeholder="Select Department"
                                isSearchable={true}
                            />
                        </div>
                        <ul className={`space-y-2 overflow-y-scroll ${employees.length > 0 ? "h-48" : "h-auto"}`}>
                            {filteredEmployees.map(emp => {
                                const isSelected = alertData.recipients.includes(emp.employeeID);
                                return (
                                    <li key={emp.employeeID} onClick={() => handleRecipientSelection(emp)} 
                                        className={`flex items-center justify-between p-2 rounded-md border text-xs lg:text-sm transition-all duration-300
                                            ${isSelected ? "bg-green-300" : "bg-white"} hover:bg-green-200`}>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={alertData.recipients.includes(emp.employeeID)}
                                                onChange={() => handleRecipientSelection(emp)}
                                                className="form-checkbox"
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
                    <button className="bg-purple-300 text-black text-xs lg:text-sm transition-all duration-300 p-2 mt-0 rounded-lg text-center hover:bg-indigo-700 hover:text-white max-w-40" type="submit">Submit</button>
                    <button className="bg-purple-300 text-black text-xs lg:text-sm transition-all duration-300 p-2 mt-0 rounded-lg text-center hover:bg-indigo-700 hover:text-white max-w-40" type="button" onClick={onCancel}>Cancel</button>
                </div>
            </div>


            
        </form>
    );
};

export default CreateDepartmentAlert;
