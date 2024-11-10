import React, { useEffect, useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useSelector } from 'react-redux'
import axios from '../api/axios'
import CreateEmployee from '../components/CreateEmployee'
import EditEmployee from '../components/EditEmployee'
import BackToTopButton from '../components/BackToTopButton';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeID, setSelectedEmployeeID] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  useEffect(() => {
  if (companyID) {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`/companies/${companyID}/employees`);
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }
}, [companyID]);

  const handleEditEmployee = (employeeID) => {
    setSelectedEmployeeID(employeeID);
  };

  const handleDeleteEmployee = async (employeeID) => {
    try {
      await axios.delete(`/employees/${employeeID}`);
      setEmployees((prevEmployees) =>
        prevEmployees.filter((employee) => employee.employeeID !== employeeID)
      );
      alert(`Employee with ID ${employeeID} deleted successfully`);
    } catch (error) {
      console.error("Error deleting employee:", error);
    }
  };

  return (
    <div className='flex flex-col gap-4 text-black'>
    <div className='flex flex-row items-center justify-between'>
      <h1 className='text-lg font-bold text-black'>Employees</h1>
      <Dialog>
        <DialogTrigger asChild>
          <button className="flex flex-row gap-2 items-center text-nowrap bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4">
            Add New Employee
            <img className="min-w-[30px] min-h-[30px]" src="./images/new-employee.svg" alt="new employee icon" />
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>Add a new employee to the system.</DialogDescription>
          <CreateEmployee />
        </DialogContent>
      </Dialog>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full bg-white text-black rounded-lg text-sm">
        <thead>
          <tr>
            <th className="px-2 py-2 md:px-4">Employee ID</th>
            <th className="px-0 py-2 md:px-4">Name</th>
            {/* <th className="px-4 py-2">Date of Birth</th> */}
            <th className="px-0 py-2 md:px-4">Department</th>
            {/* <th className="px-4 py-2">Role</th> */}
            <th className="pr-2 py-2 md:px-4"></th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {employees.map(employee => (
            <tr className='border-t border-[#E4E7EC] hover:bg-[#F9FAFB]' key={employee.employeeID}>
              <td className="px-2 py-2 md:px-4">{employee.employeeID}</td>
              <td className="px-0 py-2 md:px-4">{employee.firstName} {employee.lastName}</td>
              {/* <td className="px-4 py-2">{new Date(employee.dateOfBirth).toLocaleDateString()}</td> */}
              <td className="px-0 py-2 md:px-4">{employee.departmentID}</td>
              {/* <td className="px-4 py-2">{employee.role}</td> */}
              <td className="pr-2 py-2 md:px-4 flex flex-row gap-2 my-6 md:my-0 justify-end md:mr-5">
                <Dialog onOpenChange={(open) => { if (!open) setSelectedEmployeeID(null); }}>
                    <DialogTrigger asChild>
                      <button className='p-2 rounded m-0 border-2 hover:cursor-pointer hover:border-[#4A1FB8]' onClick={() => handleEditEmployee(employee.employeeID)}>
                        <img className="min-w-[16px] min-h-[16px]" src="./images/edit.svg" alt="edit icon" />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Edit Employee</DialogTitle>
                      <DialogDescription>Edit employee details.</DialogDescription>
                      {selectedEmployeeID && (
                        <EditEmployee employeeID={selectedEmployeeID} onClose={() => setSelectedEmployeeID(null)} />
                      )}
                    </DialogContent>
                </Dialog>
                <button className='p-2 rounded m-0 border-2 hover:cursor-pointer hover:border-[#4A1FB8]' onClick={() => handleDeleteEmployee(employee.employeeID)}>
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

export default Employee;