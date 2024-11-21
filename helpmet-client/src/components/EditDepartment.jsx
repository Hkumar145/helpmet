import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const DialogClose = DialogPrimitive.Close;

const EditDepartment = ({ departmentID, onClose, onSuccess }) => {
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
      toast.success("Department updated successfully.", {
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      toast.error(`Error updating department: ${error.response?.data?.message || error.message}`, {
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
          placeholder="Department Name"
          className="border p-2"
          value={departmentName}
          onChange={(e) => setDepartmentName(e.target.value)}
          required
        />
        <div className='flex flex-row justify-end gap-2'>
          <DialogClose asChild>
            <button type="button" className="text-[#98A2B3] hover:text-[#475467] border rounded text-xs px-4 py-2 my-0" onClick={onClose}>Cancel</button>
          </DialogClose>
          <DialogClose asChild>
            <button type="submit" className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-0">Update Department</button>
          </DialogClose>
        </div>
      </form>
    </main>
  );
};

export default EditDepartment;
