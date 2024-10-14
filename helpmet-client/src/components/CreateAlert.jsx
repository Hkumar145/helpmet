import React, { useState, useEffect } from "react";
import Select from "react-select";
import axios from "../api/axios";

const CreateAlert = ({ alertType, companyID, onCancel }) => {
  const [alertData, setAlertData] = useState({
    alertName: "",
    description: "",
    scheduleTime: "",
    recipientID: [],
  });
  const [recipients, setRecipients] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch employees or departments based on alertType
    const fetchRecipients = async () => {
      setLoading(true);
      try {
        if (alertType === "employee") {
          // Fetch employees for the company
          const response = await axios.get(`/companies/${companyID}/employees`);
          const employeeOptions = response.data.map((employee) => ({
            value: employee.employeeID,
            label: `${employee.employeeID} - ${employee.firstName} ${employee.lastName} ${employee.email}`,
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
      setLoading(false);
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
    const selectedRecipients = selectedOptions.map(option => option.value); // Extract only the IDs
    setAlertData({
      ...alertData,
      recipients: selectedRecipients,  // Store array of selected recipient IDs
    });
  };
  const createNewAlert = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/companies/${companyID}/alerts`, {
        ...alertData,
        type: alertType,
      });
      alert("Alert created successfully!");
      onCancel(); // Go back to the alert list after creating
    } catch (error) {
      console.error("Error creating alert:", error);
    }
  };

  return (
    <form onSubmit={createNewAlert}>
        <h2>Create {alertType === "employee" ? "Employee" : "Department"} Alert</h2>
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
        isLoading={loading}
        placeholder="Select Recipients"
        isSearchable={true}
        isMulti={true}
        />

        <button type="submit">Create Alert</button>
        <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default CreateAlert;