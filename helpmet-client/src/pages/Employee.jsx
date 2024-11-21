import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import CreateEmployee from "../components/CreateEmployee";
import EditEmployee from "../components/EditEmployee";
import BackToTopButton from "../components/BackToTopButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "../components/Loader";

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployeeID, setSelectedEmployeeID] = useState(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchEmployees = async () => {
    if (!companyID) return;
    try {
      setLoading(true);
      const response = await axios.get(`/companies/${companyID}/employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, [companyID]);

  // useEffect(() => {
  //   if (companyID) {
  //     const fetchEmployees = async () => {
  //       try {
  //         const response = await axios.get(`/companies/${companyID}/employees`);
  //         setEmployees(response.data);
  //         setLoading(false);
  //       } catch (error) {
  //         console.error("Error fetching employees:", error);
  //         setLoading(false);
  //       }
  //     };

  //     fetchEmployees();
  //   }
  // }, [companyID]);

  const handleEditEmployee = (employeeID) => {
    setSelectedEmployeeID(employeeID);
  };

  const handleDeleteEmployee = async () => {
    try {
      if (employeeToDelete) {
        await axios.delete(`/employees/${employeeToDelete}`);
        setEmployees((prevEmployees) =>
          prevEmployees.filter(
            (employee) => employee.employeeID !== employeeToDelete
          )
        );
        toast.success(
          `Employee with ID ${employeeToDelete} deleted successfully`,
          {
            className: "custom-toast",
            bodyClassName: "custom-toast-body",
          }
        );
        setEmployeeToDelete(null); // Clear after deletion
      }
    } catch (error) {
      toast.error(`Error deleting employee: ${error}`, {
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      });
    }
    setConfirmDeleteDialogOpen(false);
  };

  const confirmDelete = (employeeID) => {
    setEmployeeToDelete(employeeID);
    setConfirmDeleteDialogOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 text-black">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-lg font-bold text-black">Employees</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex flex-row gap-2 items-center text-nowrap bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4">
              Add New Employee
              <img
                className="min-w-[16px] min-h-[16px]"
                src="./images/new-employee.svg"
                alt="new employee icon"
              />
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add New Employee</DialogTitle>
            <DialogDescription>
              Add a new employee to the system.
            </DialogDescription>
            <CreateEmployee onClose={() => setDialogOpen(false)} 
              onSuccess={() => {
                setTimeout(() => {
                  fetchEmployees();
                }, 3000);
              }}/>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-lg shadow-md">
        {employees.length === 0 ? (
          <div className="text-center bg-white rounded-lg py-[120px]">
            <p className="font-bold">No Employee Available</p>
            <p className="text-sm text-gray-500">
              Start by adding new employee to the list
            </p>
          </div>
        ) : (
          <table className="min-w-full bg-white text-black rounded-lg text-sm">
            <thead className="text-left bg-[#f8f8f8]">
              <tr>
                <th className="px-2 py-2 md:px-4">Employee ID</th>
                <th className="px-0 py-2 md:px-4">Name</th>
                {/* <th className="px-4 py-2">Date of Birth</th> */}
                <th className="px-0 py-2 md:px-4">Department</th>
                {/* <th className="px-4 py-2">Role</th> */}
                <th className="pr-2 py-2 md:px-4"></th>
              </tr>
            </thead>
            <tbody className="text-left">
              {employees.map((employee) => (
                <tr
                  className="border-t border-[#E4E7EC] hover:bg-[#F9FAFB]"
                  key={employee.employeeID}
                >
                  <td className="px-2 py-2 md:px-4">{employee.employeeID}</td>
                  <td className="px-0 py-2 md:px-4">
                    {employee.firstName} {employee.lastName}
                  </td>
                  {/* <td className="px-4 py-2">{new Date(employee.dateOfBirth).toLocaleDateString()}</td> */}
                  <td className="px-0 py-2 md:px-4">{employee.departmentID}</td>
                  {/* <td className="px-4 py-2">{employee.role}</td> */}
                  <td className="pr-2 py-2 md:px-4 flex flex-row gap-2 my-6 md:my-0 justify-end md:mr-5">
                    <Dialog
                      onOpenChange={(open) => {
                        if (!open) setSelectedEmployeeID(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <button
                          className="p-2 rounded m-0 border-2 hover:cursor-pointer hover:border-[#4A1FB8]"
                          onClick={() =>
                            handleEditEmployee(employee.employeeID)
                          }
                        >
                          <img
                            className="min-w-[16px] min-h-[16px]"
                            src="./images/edit.svg"
                            alt="edit icon"
                          />
                        </button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogTitle>Edit Employee</DialogTitle>
                        <DialogDescription>
                          Edit employee details.
                        </DialogDescription>
                        {selectedEmployeeID && (
                          <EditEmployee
                            employeeID={selectedEmployeeID}
                            onClose={() => setSelectedEmployeeID(null)}
                            onSuccess={() => {
                              setTimeout(() => {
                                fetchEmployees();
                              }, 3000);
                            }}
                          />
                        )}
                      </DialogContent>
                    </Dialog>
                    <button
                      className="p-2 rounded m-0 border-2 hover:cursor-pointer hover:border-[#4A1FB8]"
                      onClick={() => confirmDelete(employee.employeeID)}
                    >
                      <img
                        className="min-w-[16px] min-h-[16px]"
                        src="./images/trash.svg"
                        alt="delete icon"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <Dialog
        open={confirmDeleteDialogOpen}
        onOpenChange={setConfirmDeleteDialogOpen}
      >
        <DialogContent>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this employee?
          </DialogDescription>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirmDeleteDialogOpen(false)}
              className="text-[#98A2B3] hover:text-[#475467] border rounded text-xs px-4 py-2 my-0"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteEmployee}
              className="bg-red-600 text-white font-bold hover:bg-red-800 text-xs px-4 py-2 rounded my-0"
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

export default Employee;
