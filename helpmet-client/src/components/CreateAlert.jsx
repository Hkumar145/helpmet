import React, { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import Select from "react-select";
import axios from "../api/axios";
import { useSelector } from "react-redux";

const CreateAlert = ({ alertType, companyID, fetchAlerts, onCancel }) => {
  const [alertData, setAlertData] = useState({
    alertName: "",
    description: "",
    scheduleTime: "",
    recipientID: [],
    cc: [],
    attachments: [],
  });
  const [recipients, setRecipients] = useState([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const senderEmail = useSelector((state) => state.user.email);

  useEffect(() => {
    // Fetch employees or departments based on alertType
    const fetchRecipients = async () => {
      setLoadingRecipients(true);
      try {
        if (alertType === "employee") {
          // Fetch employees for the company
          const response = await axios.get(`/companies/${companyID}/employees`);
          const employeeOptions = response.data.map((employee) => ({
            value: employee.employeeID,
            label: `${employee.employeeID} - ${employee.firstName} ${employee.lastName}`,
          }));
          setRecipients(employeeOptions);
        } else if (alertType === "department") {
          // Fetch departments for the company
          const response = await axios.get(`/companies/${companyID}/departments`);
          const departmentOptions = response.data.map((department) => ({
            value: department.departmentID,
            label: `${department.departmentID} - ${department.departmentName}`,
          }));
          setRecipients(departmentOptions);
        }
      } catch (error) {
        console.error(error);
      }
      setLoadingRecipients(false);
    };

    fetchRecipients();
  }, [alertType, companyID]);

  const inputFields = (e) => {
    setAlertData({
      ...alertData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRecipientsChange = (selectedOptions) => {
    const selectedRecipients = selectedOptions.map((option) => option.value);
    const recipientEmails = selectedOptions.map((option) => option.email);
    setAlertData({
      ...alertData,
      recipients: selectedRecipients,
      recipientEmails,
    });
  };

  const handleCCChange = (e) => {
    const ccEmails = e.target.value
      .split(",")
      .map(email => email.trim())
      .filter(email => email !== ""); 

    setAlertData({
      ...alertData,
      cc: ccEmails,
    });
  };

  // Handle file attachments
  const handleFileChange = (e) => {
    setAlertData({
      ...alertData,
      attachments: e.target.files, // Store the files as an array-like object
    });
  };

  // Use react-dropzone to upload file 
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

  const createNewAlert = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("alertName", alertData.alertName);
    formData.append("description", alertData.description);
    formData.append("scheduleTime", alertData.scheduleTime);
    formData.append("recipients", JSON.stringify(alertData.recipients))
    formData.append("cc", JSON.stringify(alertData.cc));

    if (alertData.attachments.length > 0) {
      alertData.attachments.forEach((file) => {
        formData.append("attachments", file);
      });
    }

    try {
      await axios.post(`/companies/${companyID}/alerts`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("Alert created successfully!");

    const response = await axios.get(`/companies/${companyID}/employees`);
    const allEmployees = response.data;
    const recipientEmails = allEmployees
      .filter((employee) => alertData.recipients.includes(employee.employeeID))
      .map((employee) => employee.email);

    // Ensure we received valid recipient emails
    if (!recipientEmails || recipientEmails.length === 0) {
      throw new Error("No valid recipient emails found.");
    }

    // send alert email
    await axios.post("/email/send-alert-email", {
      recipients: recipientEmails,
      senderEmail: senderEmail,
      alertDetails: {
        alertName: alertData.alertName,
        description: alertData.description,
      },
      cc: alertData.cc,
      attachments: alertData.attachments,
    });
      fetchAlerts();
      onCancel();
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg w-full text-left table-fixed">
      <form 
      className="flex flex-col gap-2"
      onSubmit={createNewAlert}>
        <h2 className="text-white">Create {alertType === "employee" ? "Employee" : "Department"} Alert</h2>
        <label className="text-white">Alert Name</label>
        <input
          type="text"
          name="alertName"
          value={alertData.alertName}
          onChange={inputFields}
          className="p-3 bg-slate-200 border border-gray-700 rounded-sm"
          required
        />

        <label className="text-white">Description</label>
        <textarea
          name="description"
          value={alertData.description}
          onChange={inputFields}
          className="p-3 bg-slate-200 border-gray-700 rounded-sm"
          required
        />

        <div {...getRootProps({ className: "flex flex-row item-center justify-between border-dashed border-2 p-4 border-gray-500 bg-gray-700 rounded-lg" })}>
          <label className="text-white mt-0">Attachments</label>
          <input {...getInputProps()} />
          <p className="text-purple-400 cursor-pointer">Click here to upload or drag and drop files</p>
        </div>

        {/* Display attached files with removal option */}
        <div className="mt-2">
          {alertData.attachments.length > 0 && (
            <ul>
              {alertData.attachments.map((file, index) => (
                <li key={index} className="flex justify-between items-center bg-gray-900 p-2 mb-2 rounded-lg text-white">
                  <span>{file.name}</span>
                  <button onClick={() => removeFile(file)} className="text-sm text-red-400 hover:text-red-600 mt-0">Remove</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Select
          name="recipients"
          options={recipients}
          onChange={handleRecipientsChange}
          isLoading={loadingRecipients}
          placeholder="Select Recipients"
          isSearchable={true}
          isMulti={true}
          styles={{
            multiValue: (styles) => ({
              ...styles,
              display: "inline-flex",
              maxWidth: "100%",
            }),
            multiValueLabel: (styles) => ({
              ...styles,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }),
            multiValueRemove: (styles) => ({
              ...styles,
              display: 'inline-flex',
            }),
            control: (styles) => ({
              ...styles,
              flexWrap: "wrap",
            }),
          }}
        />

        <label className="text-white">CC</label>
        <input
          type="text"
          name="cc"
          placeholder="name@helpmet.com"
          value={alertData.cc.join(", ")}
          onChange={handleCCChange}
          className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />
        
       
        <div className="flex flex-row justify-end gap-2">
          <button className="bg-purple-300 text-black text-sm p-2 mt-0 rounded-lg text-center hover:bg-indigo-700 hover:text-white max-w-40" type="submit">Submit</button>
          <button className="bg-purple-300 text-black text-sm p-2 mt-0 rounded-lg text-center hover:bg-indigo-700 hover:text-white max-w-40" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateAlert;
