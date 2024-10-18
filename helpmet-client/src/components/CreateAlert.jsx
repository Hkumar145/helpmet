import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "../api/axios";

const CreateAlert = ({ alertType, companyID, onCancel }) => {
  const [alertData, setAlertData] = useState({
    alertName: "",
    description: "",
    scheduleTime: "",
    recipientID: [],
    cc: [],
    attachments: null,
  });
  const [recipients, setRecipients] = useState([]);
  const [ccOptions, setCcOptions] = useState([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [loadingCc, setLoadingCc] = useState(false);

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
            label: `${employee.employeeID} - ${employee.firstName} ${employee.lastName} (${employee.email})`,
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

    // Fetch employees for the CC options, regardless of alertType
    const fetchCcOptions = async () => {
      setLoadingCc(true);
      try {
        const response = await axios.get(`/companies/${companyID}/employees`);
        const employeeOptions = response.data.map((employee) => ({
          value: employee.employeeID,
          label: `${employee.employeeID} - ${employee.firstName} ${employee.lastName} (${employee.email})`,
        }));
        setCcOptions(employeeOptions);
      } catch (error) {
        console.error("Error fetching CC options:", error);
      }
      setLoadingCc(false);
    };

    fetchRecipients();
    fetchCcOptions();
  }, [alertType, companyID]);

  const inputFields = (e) => {
    setAlertData({
      ...alertData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRecipientsChange = (selectedOptions) => {
    const selectedRecipients = selectedOptions.map((option) => option.value);
    setAlertData({
      ...alertData,
      recipients: selectedRecipients,
    });
  };

  const handleCCChange = (selectedOptions) => {
    const selectedCC = selectedOptions.map((option) => option.value);
    setAlertData({
      ...alertData,
      cc: selectedCC,
    });
  };

  // Handle file attachments
  const handleFileChange = (e) => {
    setAlertData({
      ...alertData,
      attachments: e.target.files, // Store the files as an array-like object
    });
  };

  const createNewAlert = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("alertName", alertData.alertName);
    formData.append("description", alertData.description);
    formData.append("scheduleTime", alertData.scheduleTime);
    formData.append("recipients", JSON.stringify(alertData.recipients))
    formData.append("cc", JSON.stringify(alertData.cc));

    if (alertData.attachments) {
      Array.from(alertData.attachments).forEach((file) => {
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
        <input
          type="text"
          name="alertName"
          placeholder="Alert Name"
          value={alertData.alertName}
          onChange={inputFields}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={alertData.description}
          onChange={inputFields}
          required
        />

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

        <Select
          name="cc"
          options={ccOptions}
          onChange={handleCCChange}
          isLoading={loadingCc}
          placeholder="Select CC"
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
        
        <input type="file" multiple onChange={handleFileChange} />
        <div className="flex flex-row justify-end gap-2">
          <button className="bg-green-700 text-white text-sm p-2 mt-0 rounded-lg text-center hover:opacity-95 max-w-40" type="submit">Create Alert</button>
          <button className="bg-green-700 text-white text-sm p-2 mt-0 rounded-lg text-center hover:opacity-95 max-w-40" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateAlert;
