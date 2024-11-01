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
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const senderEmail = useSelector((state) => state.user.email);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    // Fetch departments or employees based on alertType
    const fetchRecipients = async () => {
      setLoadingRecipients(true);
      try {
        if (alertType === "employee") {
          // Fetch all employees for the company
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
          setDepartmentOptions(departmentOptions);
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

  // const handleDepartmentChange = async (selectedDepartment) => {
  //   const departmentID = selectedDepartment.value;
  //   setAlertData({
  //     ...alertData,
  //     recipients: [], // Reset recipients when changing department
  //     selectedDepartment: departmentID,
  //   });

  //   try {
  //     // Fetch employees of the selected department
  //     const response = await axios.get(`/companies/${companyID}/departments/${departmentID}/employees`);
  //     const employeeOptions = response.data.map((employee) => ({
  //       value: employee.employeeID,
  //       label: `${employee.employeeID} - ${employee.firstName} ${employee.lastName}`,
  //     }));
  //     setEmployeeOptions(employeeOptions);
  //   } catch (error) {
  //     console.error("Error fetching employees for department:", error);
  //   }
  // };

  const handleDepartmentChange = async (selectedOption) => {
    try {
      const { data } = await axios.get(`/companies/${companyID}/departments/${selectedOption.value}/employees`);
      setEmployees(data);
      setFilteredEmployees(data); // Initialize filtered list
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    setFilteredEmployees(
      employees.filter(emp => 
        emp.employeeID.toLowerCase().includes(term) || 
        `${emp.firstName} ${emp.lastName}`.toLowerCase().includes(term)
      )
    );
  };

  const handleRecipientSelection = (employeeID) => {
    setAlertData(prevData => ({
      ...prevData,
      recipients: prevData.recipients.includes(employeeID)
        ? prevData.recipients.filter(id => id !== employeeID)
        : [...prevData.recipients, employeeID],
    }));
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

  const createNewAlert = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("alertName", alertData.alertName);
    formData.append("description", alertData.description);
    formData.append("scheduleTime", alertData.scheduleTime);
    formData.append("recipients", JSON.stringify(alertData.recipients));
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

      // Fetch all employees to get their emails by employee ID
      const response = await axios.get(`/companies/${companyID}/employees`);
      const allEmployees = response.data;
      const recipientEmails = allEmployees
        .filter((employee) => alertData.recipients.includes(employee.employeeID))
        .map((employee) => employee.email);

      if (!recipientEmails || recipientEmails.length === 0) {
        throw new Error("No valid recipient emails found.");
      }

      // Send alert email
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
      <form className="flex flex-col gap-2" onSubmit={createNewAlert}>
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

        {alertType === "department" && (
          <>
            <label className="text-white">Select Department</label>
            <Select
              options={departmentOptions}
              onChange={handleDepartmentChange}
              placeholder="Select Department"
              isSearchable={true}
            />

            {/* <label className="text-white">Select Employees in Department</label>
            <Select
              options={employeeOptions}
              onChange={handleRecipientsChange}
              isLoading={loadingRecipients}
              placeholder="Select Employees"
              isSearchable={true}
              isMulti={true}
            /> */}
            <label className="text-white mt-4">Search Employees</label>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search by ID or name"
          className="p-2 bg-gray-700 rounded-lg text-white border border-gray-500"
        />

        <div className="mt-4 bg-gray-700 rounded-lg p-2">
          <h3 className="text-white font-semibold">Members</h3>
          <ul className="space-y-2">
            {filteredEmployees.map(emp => (
              <li key={emp.employeeID} className="flex items-center justify-between p-2 bg-gray-800 rounded-md">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={alertData.recipients.includes(emp.employeeID)}
                    onChange={() => handleRecipientSelection(emp.employeeID)}
                    className="form-checkbox text-green-500"
                  />
                  <img src={emp.photoUrl} alt="Employee" className="w-10 h-10 rounded-full" />
                  <span className="text-white font-medium">{emp.employeeID}</span>
                  <span className="text-gray-300">{emp.firstName} {emp.lastName}</span>
                </div>
                <button className="text-blue-400 hover:underline">View Details</button>
              </li>
            ))}
          </ul>
        </div>
            
            {/* Employee Table with Checkboxes */}
            {/* {selectedDepartment && (
              <div className="bg-white rounded-md shadow-md p-4 my-4">
                <h3 className="text-lg font-semibold mb-2">Select Employees</h3>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Select</th>
                      <th>Employee ID</th>
                      <th>Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {employees.map(employee => (
                      <tr key={employee.employeeID} className="border-b">
                        <td>
                          <input
                            type="checkbox"
                            checked={alertData.recipientIDs.includes(employee.employeeID)}
                            onChange={() => handleEmployeeSelection(employee.employeeID)}
                          />
                        </td>
                        <td>{employee.employeeID}</td>
                        <td>{employee.firstName} {employee.lastName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )} */}
          </>
        )}

        {alertType === "employee" && (
          <Select
            options={recipients}
            onChange={handleRecipientsChange}
            isLoading={loadingRecipients}
            placeholder="Select Recipients"
            isSearchable={true}
            isMulti={true}
          />
        )}

        <label className="text-white">CC</label>
        <input
          type="text"
          name="cc"
          placeholder="name@helpmet.com"
          value={alertData.cc.join(", ")}
          onChange={handleCCChange}
          className="p-3 bg-gray-800 border border-gray-700 rounded-lg text-white"
        />

        <div {...getRootProps({ className: "flex flex-row item-center justify-between border-dashed border-2 p-4 border-gray-500 bg-gray-700 rounded-lg" })}>
          <label className="text-white mt-0">Attachments</label>
          <input {...getInputProps()} />
          <p className="text-purple-400 cursor-pointer">Click here to upload or drag and drop files</p>
        </div>

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

        <div className="flex flex-row justify-end gap-2">
          <button className="bg-purple-300 text-black text-sm p-2 mt-0 rounded-lg text-center hover:bg-indigo-700 hover:text-white max-w-40" type="submit">Submit</button>
          <button className="bg-purple-300 text-black text-sm p-2 mt-0 rounded-lg text-center hover:bg-indigo-700 hover:text-white max-w-40" type="button" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateAlert;
