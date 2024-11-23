import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import { IconButton } from "./ui/button";
import CustomSelect from "./ui/select";
import Avatar from "react-avatar";
import {useNavigate, useParams} from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const MAX_NOTE_LENGTH = 300;

const EditDepartmentAlert = () => {
    const navigate = useNavigate();
    const companyID = useSelector((state) => state.user.currentUser?.companyID);
    const { alertId } = useParams();
    const [alertData, setAlertData] = useState({ 
        alertName: "", 
        description: "", 
        recipients: [], 
        cc: "",
        attachments: [] 
    });
    const [departmentOptions, setDepartmentOptions] = useState([]);
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [employees, setEmployees] = useState([]);
    const [allSelectedEmployees, setAllSelectedEmployees] = useState([]); 
    const [removedAttachments, setRemovedAttachments] = useState([]);
    const [tempRecipients, setTempRecipients] = useState([]);

    const onCancel = () => {
        navigate(-1);
    } 

    const fetchRecipientDetails = async (recipientIDs) => {
        const ids = recipientIDs.flatMap((recipient) => {
            if (typeof recipient === "string" && recipient.startsWith("[")) {
                try {
                    return JSON.parse(recipient);
                } catch {
                    return [];
                }
            } else if (Array.isArray(recipient)) {
                return recipient;
            }
            return [recipient];
        });
    
        const details = await Promise.all(
            ids.map(async (id) => {
                try {
                    const response = await axios.get(`/employees/${id}`);
                    const employee = response.data;
                    return {
                        employeeID: employee.employeeID,
                        firstName: employee.firstName,
                        lastName: employee.lastName,
                        label: `${employee.employeeID} - ${employee.firstName} ${employee.lastName}`
                    };
                } catch (error) {
                    return { employeeID: id, label: "Unknown recipient" };
                }
            })
        );
        setAllSelectedEmployees(details.flat());
    };

    useEffect(() => {
        setTempRecipients(alertData.recipients);
    }, [alertData.recipients]);  

    useEffect(() => {
        axios.get(`/alerts/${alertId}`)
            .then(async (res) => {
                let data = res.data;
                data.recipients = JSON.parse(data.recipients[0]);
                console.log("data: ", data);
                setAlertData({
                    ...data,
                    attachments: data.attachments.map((item) => item.split("/").pop())
                });
                setTempRecipients(data.recipients);
                fetchRecipientDetails(data.recipients);
            })
            .catch((error) => {
                console.error("Error fetching alert:", error);
            });
    }, [alertId]);

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
        const isSelected = tempRecipients.includes(employee.employeeID);
        const newRecipients = isSelected
            ? tempRecipients.filter(id => id !== employee.employeeID)
            : [...tempRecipients, employee.employeeID];
        setTempRecipients(newRecipients);

        const updatedSelectedEmployees = isSelected
        ? allSelectedEmployees.filter(emp => emp.employeeID !== employee.employeeID)
        : [...allSelectedEmployees, employee];
        setAllSelectedEmployees(updatedSelectedEmployees);
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
        setRemovedAttachments((prev) => [...prev, file]);
        setAlertData((prevData) => ({
            ...prevData,
            attachments: prevData.attachments.filter((f) => f !== file),
        }));
    };

    // Create new alert
    const updateAlert = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("alertName", alertData.alertName);
        formData.append("description", alertData.description);
        formData.append("recipients", JSON.stringify(tempRecipients));
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
            toast.error(`Failed to update department alert. ${error}`, {
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
                                        <span className="text-[16px]">{typeof file === "string" ? file : file.name}</span>
                                        <div>
                                            <IconButton 
                                            type={"button"} 
                                            icon="close" 
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
                
                    <div className="flex flex-col gap-1">
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
                                                <IconButton 
                                                icon="close"
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
                                    const isSelected = tempRecipients.includes(emp.employeeID);
                                    return (
                                        <li key={emp.employeeID} onClick={() => handleRecipientSelection(emp)} 
                                            className={`flex items-center justify-between p-1 pl-2 rounded-md border text-[14px]
                                                ${isSelected ? "bg-secondary20" : "bg-secondary10"}`}>
                                            <div className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={tempRecipients.includes(emp.employeeID)}
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

export default EditDepartmentAlert;
