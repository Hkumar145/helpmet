import React, { useEffect, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import CreateDepartment from '../components/CreateDepartment';
import EditDepartment from '../components/EditDepartment';
import BackToTopButton from '../components/BackToTopButton';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartmentID, setSelectedDepartmentID] = useState(null);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);
  const [departmentNameToDelete, setDepartmentNameToDelete] = useState(null);

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

  const handleDeleteDepartment = async () => {
    try {
      const departmentName = departments.find(department => department.departmentID === departmentToDelete)?.departmentName;
      
      await axios.delete(`/departments/${departmentToDelete}`);
      
      setDepartments((prevDepartments) =>
        prevDepartments.filter((department) => department.departmentID !== departmentToDelete)
      );
      
      toast.success(`${departmentName} deleted successfully`, {
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
      });
    } catch (error) {
      toast.error(`Error deleting department: ${error}`, {
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDepartmentToDelete(null);
      setDepartmentNameToDelete(null);
    }
  };

  const openDeleteConfirmation = (departmentID, departmentName) => {
    setDepartmentToDelete(departmentID);
    setDepartmentNameToDelete(departmentName);
    setDeleteDialogOpen(true);
  };

  return (
    <div className='flex flex-col gap-2 text-black'>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-lg font-bold text-black'>Departments</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className='bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4'>Add New Department</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>Add a new department to the system.</DialogDescription>
            <CreateDepartment onClose={() => setDialogOpen(false)} />
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
                    onClick={() => openDeleteConfirmation(department.departmentID)}
                  >
                    <img className="min-w-[16px] min-h-[16px]" src="./images/trash.svg" alt="delete icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>Are you sure you want to delete this department?</DialogDescription>
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={() => setDeleteDialogOpen(false)} className="text-[#98A2B3] hover:text-[#475467] text-xs px-4 py-2 my-0">
              Cancel
            </button>
            <button
              onClick={handleDeleteDepartment}
              className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-0"
            >
              Confirm
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <BackToTopButton />
    </div>
  );
};

export default Department;
