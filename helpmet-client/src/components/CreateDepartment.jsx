import React, { useState } from 'react';
import axios from '../api/axios';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSelector } from 'react-redux';

const DialogClose = DialogPrimitive.Close;

const CreateDepartment = () => {
  const [departmentName, setDepartmentName] = useState('');
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const departmentData = { departmentName, companyID };

    try {
      await axios.post(`/companies/${companyID}/departments`, departmentData);
      alert("Department created successfully.");
      setDepartmentName('');
    } catch (error) {
      console.error("Error creating department:", error.response?.data?.message || error.message);
    }
  };

  return (
    <main>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Department Name"
          className="border p-2"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          required
        />
        <div className='flex flex-row justify-between gap-4'>
          <DialogClose asChild>
            <button type="button" className="px-4 py-2 text-xs rounded mb-4 border hover:bg-[#D9D6FE] hover:text-[#6938EF]">Close</button>
          </DialogClose>
          <button type="submit" className='bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4 w-full'>Create Department</button>
        </div>
      </form>
    </main>
  );
};

export default CreateDepartment;