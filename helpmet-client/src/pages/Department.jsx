import React, { useEffect, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import CreateDepartment from '../components/CreateDepartment';
import EditDepartment from '../components/EditDepartment';

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
        <h1 className='text-lg text-black md:text-2xl'>Departments</h1>
        <Dialog>
          <DialogTrigger asChild>
            <button className='bg-green-700 text-white p-3 rounded-lg'>Create New Department</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create New Department</DialogTitle>
            <DialogDescription>Add a new department to the system.</DialogDescription>
            <CreateDepartment />
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-black mt-4 rounded-lg text-sm">
          <thead>
            <tr>
              <th className="px-2 py-2 md:px-4">Department ID</th>
              <th className="px-2 py-2 md:px-4">Name</th>
              <th className="px-2 py-2 md:px-4"></th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {departments.map(department => (
              <tr key={department.departmentID}>
                <td className="px-2 py-2 md:px-4">{department.departmentID}</td>
                <td className="px-2 py-2 md:px-4">{department.departmentName}</td>
                <td className="px-2 py-2 md:px-4 flex flex-row gap-2">
                  <Dialog onOpenChange={(open) => { if (!open) setSelectedDepartmentID(null); }}>
                    <DialogTrigger asChild>
                      <button
                        className='bg-purple-600 text-white p-2 rounded mt-0'
                        onClick={() => handleEditDepartment(department.departmentID)}
                      >
                        Edit
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
                  <button className='bg-purple-600 text-white p-2 rounded mt-0' onClick={() => handleDeleteDepartment(department.departmentID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Department;
