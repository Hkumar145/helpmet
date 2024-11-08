import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSelector } from 'react-redux';

const DialogClose = DialogPrimitive.Close;

const EditDepartment = ({ departmentID, onClose }) => {
  const [departmentName, setDepartmentName] = useState('');
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  useEffect(() => {
    const fetchDepartmentData = async () => {
      try {
        const response = await axios.get(`/departments/${departmentID}`);
        setDepartmentName(response.data.departmentName);
      } catch (error) {
        console.error("Error fetching department data:", error);
      }
    };

    fetchDepartmentData();
  }, [departmentID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const departmentData = { departmentName, companyID };

    try {
      await axios.put(`/departments/${departmentID}`, departmentData);
      alert("Department updated successfully.");
      onClose();
    } catch (error) {
      console.error("Error updating department:", error.response?.data?.message || error.message);
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
            <button type="button" className="text-black border px-6" onClick={onClose}>Close</button>
          </DialogClose>
          <button type="submit" className='bg-slate-600 hover:opacity-80 w-full text-white'>Update Department</button>
        </div>
      </form>
    </main>
  );
};

export default EditDepartment;
