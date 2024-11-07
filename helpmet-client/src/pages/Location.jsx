import React, { useEffect, useState } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import CreateLocation from '../components/CreateLocation';
import EditLocation from '../components/EditLocation';
import BackToTopButton from '../components/BackToTopButton';

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocationID, setSelectedLocationID] = useState(null);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  useEffect(() => {
    if (companyID) {
      const fetchLocations = async () => {
        try {
          const response = await axios.get(`/companies/${companyID}/locations`);
          setLocations(response.data);
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      };

      fetchLocations();
    }
  }, [companyID]);

  const handleEditLocation = (locationID) => {
    setSelectedLocationID(locationID);
  };

  const handleDeleteLocation = async (locationID) => {
    try {
      await axios.delete(`/locations/${locationID}`);
      setLocations((prevLocations) =>
        prevLocations.filter((location) => location.locationID !== locationID)
      );
      alert(`Location with ID ${locationID} deleted successfully`);
    } catch (error) {
      console.error("Error deleting location:", error);
    }
  };

  return (
    <div className='flex flex-col gap-4 text-black'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-lg font-bold text-black'>Locations</h1>
        <Dialog>
          <DialogTrigger asChild>
            <button className='bg-[#6938EF] text-white p-3 rounded-lg mt-0 text-center hover:opacity-90'>Create New Location</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create New Location</DialogTitle>
            <DialogDescription>Add a new location to the system.</DialogDescription>
            <CreateLocation />
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white text-black rounded-lg text-sm">
          <thead>
            <tr>
              <th className="px-2 py-2 md:px-4">Location ID</th>
              <th className="px-0 py-2 md:px-4">Name</th>
              <th className="pr-2 py-2 md:px-4"></th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {locations.map(location => (
              <tr className='border-t border-[#E4E7EC] hover:bg-[#F9FAFB]' key={location.locationID}>
                <td className="px-2 py-2 md:px-4">{location.locationID}</td>
                <td className="px-0 py-2 md:px-4">{location.locationName}</td>
                <td className="pr-2 py-2 md:px-4 flex flex-row gap-2 my-6 md:my-0 justify-end md:mr-5">
                  <Dialog onOpenChange={(open) => { if (!open) setSelectedLocationID(null); }}>
                    <DialogTrigger asChild>
                      <button
                        className='p-2 rounded m-0 border-2 hover:cursor-pointer hover:border-[#4A1FB8]'
                        onClick={() => handleEditLocation(location.locationID)}
                      >
                        <img className="min-w-[16px] min-h-[16px]" src="./images/edit.svg" alt="edit icon" />
                      </button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogTitle>Edit Location</DialogTitle>
                      <DialogDescription>Edit location details.</DialogDescription>
                      {selectedLocationID && (
                        <EditLocation locationID={selectedLocationID} onClose={() => setSelectedLocationID(null)} />
                      )}
                    </DialogContent>
                  </Dialog>
                  <button
                    className='p-2 rounded m-0 border-2 hover:cursor-pointer hover:border-[#4A1FB8]'
                    onClick={() => handleDeleteLocation(location.locationID)}
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

export default Location;
