import React, { useState } from 'react';
import axios from '../api/axios';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSelector } from 'react-redux';
import MapLocation from '@/components/MapLocation';

const DialogClose = DialogPrimitive.Close;

const CreateLocation = () => {
  const [locationID, setLocationID] = useState('');
  const [locationName, setLocationName] = useState('');
  const [coordinates, setCoordinates] = useState([0, 0]); // [longitude, latitude]
  const [managerID, setManagerID] = useState('');
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate coordinates is an array with exactly 2 elements
    // if (!Array.isArray(coordinates) || coordinates.length !== 2) {
    //   alert("Invalid coordinates format. Please ensure coordinates are properly selected on the map.");
    //   return;
    // }

    // // Ensure coordinates are valid numbers
    // if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
    //   alert("Invalid coordinates. Please ensure valid coordinates are selected on the map.");
    //   return;
    // }

    if(coordinates.length === 2){}
    const locationData = {
      locationID,
      locationName,
      companyID,
      coordinates, // Pass coordinates directly from state
      managerID: parseInt(managerID)
    };

    // Log coordinates and locationData to debug
    console.log("Coordinates:", coordinates);
    console.log("Location Data:", JSON.stringify(locationData, null, 2));
    try {
      const response = await axios.post(`/companies/${companyID}/createlocations`, {
        locationName,
        coordinates,
        managerID: parseInt(managerID)
      });

      if (response.status === 201) {
        alert("Location created successfully.");
        window.location.reload();
        setLocationID('');
        setLocationName('');
        setCoordinates([0, 0]); 
        setManagerID('');
      }
    } catch (error) {
      console.error("Error creating location:", error.response?.data?.message || error.message);
      if (error.response?.status === 400) {
        alert(error.response.data.message);
      } else {
        alert("Failed to create location. Please try again.");
      }
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
          placeholder="Location ID"
          className="border p-2"
          value={locationID}
          onChange={(e) => setLocationID(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Location Name"
          className="border p-2"
          value={locationName}
          onChange={(e) => setLocationName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Manager ID"
          className="border p-2"
          value={managerID}
          onChange={(e) => setManagerID(e.target.value)}
          required
        />

        <div className="w-full h-[400px] rounded-lg">
          <MapLocation onCoordinatesChange={handleMapCoordinatesChange} />
        </div>

        <div className='flex flex-row justify-between gap-4'>
          <DialogClose asChild>
            <button type="button" className="px-4 py-2 text-xs rounded mb-4 border hover:bg-[#D9D6FE] hover:text-[#6938EF]">Close</button>
          </DialogClose>
          <button type="submit" className='bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4 w-full'>Create Location</button>
        </div>
      </form>
    </main>
  );
};

export default CreateLocation;
