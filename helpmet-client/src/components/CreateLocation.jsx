import React, { useState } from 'react';
import axios from '../api/axios';
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { useSelector } from 'react-redux';

const DialogClose = DialogPrimitive.Close;

const CreateLocation = () => {
  const [locationName, setLocationName] = useState('');
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const locationData = { locationName, companyID };

    try {
      await axios.post(`/companies/${companyID}/locations`, locationData);
      alert("Location created successfully.");
      setLocationName('');
    } catch (error) {
      console.error("Error creating location:", error.response?.data?.message || error.message);
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
        <div className='flex flex-row justify-between gap-4'>
          <DialogClose asChild>
            <button type="button" className="text-black border px-6">Close</button>
          </DialogClose>
          <button type="submit" className='bg-slate-600 hover:opacity-80 w-full text-white'>Create Location</button>
        </div>
      </form>
    </main>
  );
};

export default CreateLocation;