import React, { useEffect, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import CreateDepartment from '../components/CreateDepartment';
import EditDepartment from '../components/EditDepartment';
import BackToTopButton from '../components/BackToTopButton';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentID, setSelectedDepartmentID] = useState(null);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  useEffect(() => {
    if (companyID) {
      const fetchDepartments = async () => {
        try {
          const response = await axios.get(`/companies/${companyID}/departments`);
          setDepartments(response.data);
        } catch (error) {
          console.error("Error fetching departments:", error);
        }
      };

      fetchDepartments();
    }
  }, [companyID]);

  const handleEditDepartment = (departmentID) => {
    setSelectedDepartmentID(departmentID);
  };

  const handleDeleteDepartment = async (departmentID) => {
    try {
      await axios.delete(`/departments/${departmentID}`);
      setDepartments((prevDepartments) =>
        prevDepartments.filter((department) => department.departmentID !== departmentID)
      );
      alert(`Department with ID ${departmentID} deleted successfully`);
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  return (
    <div className='flex flex-col gap-4 text-black'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-lg font-bold text-black'>Departments</h1>
        <Dialog>
          <DialogTrigger asChild>
            <button className='bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4'>Add New Department</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>Add a new department to the system.</DialogDescription>
            <CreateDepartment />
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-black rounded-lg text-sm">
          <thead>
            <tr>
              <th className="px-2 py-2 md:px-4">Department ID</th>
              <th className="px-0 py-2 md:px-4">Name</th>
              <th className="pr-2 py-2 md:px-4"></th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {departments.map(department => (
              <tr className='border-t border-[#E4E7EC] hover:bg-[#F9FAFB]' key={department.departmentID}>
                <td className="px-2 py-2 md:px-4">{department.departmentID}</td>
                <td className="px-0 py-2 md:px-4">{department.departmentName}</td>
                <td className="pr-2 py-2 md:px-4 flex flex-row gap-2 my-6 md:my-0 justify-end md:mr-5">
                  <Dialog onOpenChange={(open) => { if (!open) setSelectedDepartmentID(null); }}>
                    <DialogTrigger asChild>
                      <button
                        className='p-2 rounded m-0 border-2 hover:cursor-pointer hover:border-[#4A1FB8]'
                        onClick={() => handleEditDepartment(department.departmentID)}
                      >
                        <img className="min-w-[16px] min-h-[16px]" src="./images/edit.svg" alt="edit icon" />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Edit Department</DialogTitle>
                      <DialogDescription>Edit department details.</DialogDescription>
                      {selectedDepartmentID && (
                        <EditDepartment departmentID={selectedDepartmentID} onClose={() => setSelectedDepartmentID(null)} />
                      )}
                    </DialogContent>
                  </Dialog>
                  <button
                    className='p-2 rounded m-0 border-2 hover:cursor-pointer hover:border-[#4A1FB8]'
                    onClick={() => handleDeleteDepartment(department.departmentID)}
                  >
                    <img className="min-w-[16px] min-h-[16px]" src="./images/trash.svg" alt="delete icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <BackToTopButton />
    </div>
  );
};

export default Department;
