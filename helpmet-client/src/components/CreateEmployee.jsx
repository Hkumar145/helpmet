import React, { useState } from 'react';
import axios from '../api/axios'
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSelector } from 'react-redux'

const DialogClose = DialogPrimitive.Close;

const CreateEmployee = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [department, setDepartment] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

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
      alert("Employee created successfully.");
      setFirstName('');
      setLastName('');
      setDateOfBirth('');
      setDepartment('');
      setRole('');
      setEmail('');
    } catch (error) {
      console.error("Error creating employee:", error.response?.data?.message || error.message);
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
        <input
          type="text"
          placeholder="Role"
          className="border p-2"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
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
              className="text-black border px-6"
            >
              Close
            </button>
          </DialogClose>
          <button type="submit" className='bg-slate-600 hover:opacity-80 w-full'>
            Create Employee
          </button>
        </div>
      </form>
    </main>
  );
};

export default CreateEmployee;