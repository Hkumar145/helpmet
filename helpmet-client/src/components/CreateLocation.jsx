import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSelector } from 'react-redux';
import MapLocation from '@/components/MapLocation';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DialogClose = DialogPrimitive.Close;

const CreateLocation = ({ onClose, onSuccess }) => {
  const [locationName, setLocationName] = useState('');
  const [coordinates, setCoordinates] = useState([0, 0]); // [longitude, latitude]
  const [managerID, setManagerID] = useState('');
  const [employees, setEmployees] = useState([]);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get(`/companies/${companyID}/employees`);
        setEmployees(response.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        toast.error("Error fetching employees", {
          className: "custom-toast-error",
          bodyClassName: "custom-toast-body",
        });
      }
    };

    if (companyID) {
      fetchEmployees();
    }
  }, [companyID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const parsedManagerID = parseInt(managerID, 10);
    if (isNaN(parsedManagerID) || parsedManagerID <= 0) {
      toast.error("Invalid manager ID. Please select a valid manager.", {
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      });
      return;
    }
  
    if (!Array.isArray(coordinates) || coordinates.length !== 2 || isNaN(coordinates[0]) || isNaN(coordinates[1])) {
      toast.error("Invalid coordinates. Please select valid coordinates on the map.", {
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      });
      return;
    }
  
    try {
      // Create location
      const locationResponse = await axios.post(`/companies/${companyID}/createlocations`, {
        locationName,
        coordinates,
        managerID: parsedManagerID,
      });

      // Update employee role to Site Manager
      await axios.put(`/employees/${parsedManagerID}`, {
        role: 'Site Manager'
      });

      console.log("Location created:", locationResponse.data);
      toast.success("Location created successfully!", {
        className: "custom-toast",
        bodyClassName: "custom-toast-body",
      });
      if (onSuccess) onSuccess();
      onClose();
      // setTimeout(() => {
      //   window.location.reload();
      // }, 3200);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to create location. Please try again.", {
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      });
    }
  };
  
  const handleMapCoordinatesChange = (newCoordinates) => {
    if (Array.isArray(newCoordinates) && newCoordinates.length === 2 &&
        !isNaN(newCoordinates[0]) && !isNaN(newCoordinates[1])) {
      setCoordinates([parseFloat(newCoordinates[0]), parseFloat(newCoordinates[1])]);
    } else {
      console.error("Invalid coordinates received from map");
      setCoordinates([0, 0]);
    }
  };
  
  return (
    <main>
      <ToastContainer position="top-right" autoClose={3000} />
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Location Name"
          className="border p-2"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          required
        />

        <select
          className="border p-2 appearance-none rounded-lg"
          value={managerID}
          onChange={(e) => setManagerID(e.target.value)}
          required
          style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down"><polyline points="6 9 12 15 18 9"></polyline></svg>')`, backgroundPosition: 'right 1rem center', backgroundRepeat: 'no-repeat'
          }}
        >
          <option value="">Select Manager</option>
          {employees
            .filter(employee => employee.role !== 'Site Manager')
            .map((employee) => (
              <option key={employee.employeeID} value={employee.employeeID}>
                {employee.firstName} {employee.lastName} - ID: {employee.employeeID}
              </option>
            ))}
        </select>

        <div className="w-full h-[400px] rounded-lg">
          <MapLocation onCoordinatesChange={handleMapCoordinatesChange} />
        </div>

        <div className='flex flex-row justify-end gap-2 mt-2'>
          <DialogClose asChild>
          <button type="button" className="text-[#98A2B3] hover:text-[#475467] border rounded text-xs px-4 py-2 my-0">Cancel</button>
          </DialogClose>
          <button className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-0">Add Location</button>
        </div>
      </form>
    </main>
  );
};

export default CreateLocation;
