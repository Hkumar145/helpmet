import React, { useState } from 'react';
import axios from '../api/axios'
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSelector } from 'react-redux'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DialogClose = DialogPrimitive.Close;

const CreateEmployee = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const roleOptions = ["Site Manager", "Safety Officer", "Employee"];

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
      setFirstName('');
      setLastName('');
      setDateOfBirth('');
      setDepartment('');
      setRole('');
      setEmail('');
    } catch (error) {
      toast.error(`Error creating employee: ${error.response?.data?.message || error.message}`);
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
            >
              Close
            </button>
          </DialogClose>
          <button type="submit" className='bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4 w-full'>
            Create Employee
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateEmployee;