import React, { useEffect, useState } from 'react'
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { useSelector } from 'react-redux'
import axios from '../api/axios'
import CreateEmployee from '../components/CreateEmployee'
import EditEmployee from '../components/EditEmployee'

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeID, setSelectedEmployeeID] = useState(null);
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
    <div className='flex flex-col gap-4 text-white'>
    <div className='flex flex-row items-center justify-between'>
      <h1 className='text-2xl'>Employees</h1>
      <Dialog>
        <DialogTrigger asChild>
          <button className='bg-green-700 text-white p-3 mt-0 rounded-lg text-center hover:opacity-95'>
            Create New Employee
          </button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>Create New Employee</DialogTitle>
          <DialogDescription>Add a new employee to the system.</DialogDescription>
          <CreateEmployee />
        </DialogContent>
      </Dialog>
    </div>

    <div className="overflow-x-auto">
      <table className="min-w-full bg-gray-800 text-white mt-4 rounded-lg">
        <thead>
          <tr>
            <th className="px-4 py-2">Employee ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Date of Birth</th>
            <th className="px-4 py-2">Department</th>
            <th className="px-4 py-2">Role</th>
            <th className="px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody className='text-center'>
          {employees.map(employee => (
            <tr key={employee.employeeID}>
              <td className="px-4 py-2">{employee.employeeID}</td>
              <td className="px-4 py-2">{employee.firstName} {employee.lastName}</td>
              <td className="px-4 py-2">{new Date(employee.dateOfBirth).toLocaleDateString()}</td>
              <td className="px-4 py-2">{employee.departmentID}</td>
              <td className="px-4 py-2">{employee.role}</td>
              <td className="px-4 py-2 flex gap-2">
                <Dialog onOpenChange={(open) => { if (!open) setSelectedEmployeeID(null); }}>
                    <DialogTrigger asChild>
                      <button className='bg-purple-600 text-white p-2 rounded hover:bg-purple-800' onClick={() => handleEditEmployee(employee.employeeID)}>
                        Edit
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
                <button className='bg-purple-600 text-white p-2 rounded hover:bg-purple-800' onClick={() => handleDeleteEmployee(employee.employeeID)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
  );
};

export default Employee;
