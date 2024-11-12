import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DialogClose = DialogPrimitive.Close;

const EditEmployee = ({ employeeID, onClose }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const roleOptions = ["Site Manager", "Safety Officer", "Employee"];

  useEffect(() => {
    const fetchEmployeeData = async () => {
      try {
        const response = await axios.get(`/employees/${employeeID}`);
        const { firstName, lastName, dateOfBirth, departmentID, role, email } = response.data;
        setFirstName(firstName);
        setLastName(lastName);
        const formattedDateOfBirth = new Date(dateOfBirth).toISOString().split('T')[0];
        setDateOfBirth(formattedDateOfBirth);
        setDepartment(departmentID);
        setRole(role);
        setEmail(email);
      } catch (error) {
        console.error("Error fetching employee data:", error);
      }
    };

    fetchEmployeeData();
  }, [employeeID]);

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
      await axios.put(`/employees/${employeeID}`, employeeData);
      toast.success("Employee updated successfully.", {
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
      });
      onClose();
    } catch (error) {
      toast.error(`Error updating employee: ${error.response?.data?.message || error.message}`, {
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
        <input
          type="date"
          placeholder="Date of Birth"
          className="border p-2"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Department"
          className="border p-2"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
        <select
          className="border p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
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

        <div className='flex flex-row justify-between gap-4'>
          <DialogClose asChild>
            <button
              type="button"
              className="px-4 py-2 text-xs rounded mb-4 border hover:bg-[#D9D6FE] hover:text-[#6938EF]"
              onClick={onClose}
            >
              Close
            </button>
          </DialogClose>
          <DialogClose asChild>
            <button type="submit" className='bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4 w-full'>
              Update Employee
            </button>
          </DialogClose>
        </div>
      </form>
    </main>
  );
};

export default EditEmployee;