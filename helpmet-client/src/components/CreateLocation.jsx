import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSelector } from 'react-redux';
import MapLocation from '@/components/MapLocation';

const DialogClose = DialogPrimitive.Close;

const CreateLocation = () => {
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
      }
    };

    if (companyID) {
      fetchEmployees();
    }
  }, [companyID]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
   
  //   if (!Array.isArray(coordinates) || coordinates.length !== 2) {
  //     alert("Invalid coordinates format. Please ensure coordinates are properly selected on the map.");
  //     return;
  //   }
  //   // Validate coordinates is an array with exactly 2 elements
  //   if (!Array.isArray(coordinates) || coordinates.length !== 2) {
  //     alert("Invalid coordinates format. Please ensure coordinates are properly selected on the map.");
  //     return;
  //   }

  //   // Ensure coordinates are valid numbers
  //   if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
  //     alert("Invalid coordinates. Please ensure valid coordinates are selected on the map.");
  //     return;
  //   }

  //   if(coordinates.length === 2){}
  //   const locationData = {
  //     locationName,
  //     companyID,
  //     coordinates, // Pass coordinates directly from state
  //     managerID: parseInt(managerID)
  //   };
  //   console.log(managerID)
  //   // Log coordinates and locationData to debug
  //   console.log("Coordinates:", coordinates);
  //   console.log("Location Data:", JSON.stringify(locationData, null, 2));
  //   try {
  //     // Create location
  //     const response = await axios.post(`/companies/${companyID}/createlocations`, {
  //       locationName,
  //       coordinates,
  //       managerID: parseInt(managerID)
  //     });

  //     // Update employee role to site manager
  //     await axios.put(`/employees/${managerID}`, {
  //       role: 'Site Manager'
  //     });
  //     if (response.status === 201) {
  //       alert("Location created successfully!");
  //       window.location.reload();
  //       setLocationName('');
  //       setCoordinates([0, 0]); 
  //       setManagerID('');
  //       shouldClose: true;
  //     }
  //   } catch (error) {
  //     console.error("Error creating location:", error.response?.data?.message || error.message);
  //     if (error.response?.status === 400) {
  //       alert(error.response.data.message);
  //     } else {
  //       alert("Failed to create location. Please try again.");
  //     }
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted with:", { locationName, coordinates, managerID });
  
    // Ensure managerID is valid
    const parsedManagerID = parseInt(managerID, 10);
    if (isNaN(parsedManagerID) || parsedManagerID <= 0) {
      alert("Invalid manager ID. Please select a valid manager.");
      return;
    }
  
    // Validate coordinates
    if (!Array.isArray(coordinates) || coordinates.length !== 2 || isNaN(coordinates[0]) || isNaN(coordinates[1])) {
      alert("Invalid coordinates. Please select valid coordinates on the map.");
      return;
    }
  
    const locationData = {
      locationName,
      coordinates,
      managerID: parsedManagerID,
    };
  
    try {
      const response = await axios.post(`/companies/${companyID}/createlocations`, locationData);
  
      if (response.status === 201) {
        alert("Location created successfully!");
        setLocationName('');
        setCoordinates([0, 0]);
        setManagerID('');
      }
    } catch (error) {
      console.error("Error creating location:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to create location.");
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
          className="border p-2"
          value={managerID}
          onChange={(e) => setManagerID(e.target.value)}
          required
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
