import React, { useEffect, useState } from 'react';
import axios from '../api/axios'
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";

const DialogClose = DialogPrimitive.Close;

const CreateEmployee = ({ onClose, onSuccess }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [department, setDepartment] = useState('');
  const [departments, setDepartments] = useState([]);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const roleOptions = ["Site Manager", "Safety Officer", "Employee"];

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`/companies/${companyID}/departments`);
        setDepartments(response.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };

    if (companyID) {
      fetchDepartments();
    }
  }, [companyID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const employeeData = {
      firstName,
      lastName,
      dateOfBirth,
      departmentID: department,
      role,
      companyID,
      email,
    };

    try {
      const response = await axios.post(`/companies/${companyID}/employees`, employeeData);
      toast.success("Employee created successfully.", {
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
      });
      if (onSuccess) onSuccess();
      setFirstName('');
      setLastName('');
      setDateOfBirth('');
      setDepartment('');
      setRole('');
      setEmail('');
      onClose();
    } catch (error) {
      toast.error(`Error creating employee: ${error.response?.data?.message || error.message}`, {
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      });
    }
  };

  return (
    <main>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="First Name"
          className="border p-2"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Last Name"
          className="border p-2"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
        <DateTimePicker
          className="injury-datetime-picker"
          value={dateOfBirth}
          onChange={setDateOfBirth}
          required
          disableClock={true}
          clearIcon={null}
          calendarIcon={null}
          format='y-MM-dd'
          maxDate={new Date()}
        />
        <select
          className="border p-2 appearance-none rounded-lg"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat'
          }}
        >
          <option value="" disabled>- Select Department -</option>
          {departments.map((dept) => (
            <option key={dept.departmentID} value={dept.departmentID}>
              {dept.departmentName}
            </option>
          ))}
        </select>
        <select
          className="border p-2 appearance-none rounded-lg"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat'
          }}
        >
          <option value="" disabled>- Select Role -</option>
          {roleOptions.map((roleOption) => (
            <option key={roleOption} value={roleOption}>
              {roleOption}
            </option>
          ))}
        </select>
        <input
          type="email"
          placeholder="Email"
          className="border p-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <div className='flex flex-row justify-end gap-2'>
          <DialogClose asChild>
            <button
              type="button"
              className="text-[#98A2B3] hover:text-[#475467] border rounded text-xs px-4 py-2 my-0"
            >
              Cancel
            </button>
          </DialogClose>
          <button type="submit" className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-0">
            Create Employee
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateEmployee;