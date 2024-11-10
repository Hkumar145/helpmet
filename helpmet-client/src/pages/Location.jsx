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
  const [expandedLocationID, setExpandedLocationID] = useState(null);
  const [employees, setEmployees] = useState([]);
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

      const fetchEmployees = async () => {
        try {
          const response = await axios.get(`/companies/${companyID}/employees`);
          setEmployees(response.data);
        } catch (error) {
          console.error("Error fetching employees:", error);
        }
      };

      fetchLocations();
      fetchEmployees();
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

  const toggleLocationDetails = (locationID) => {
    setExpandedLocationID(expandedLocationID === locationID ? null : locationID);
  };

  return (
    <div className='flex flex-col gap-4 text-black'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-lg font-bold text-black'>Locations</h1>
        <Dialog>
          <DialogTrigger asChild>
          <button className="flex flex-row gap-2 items-center text-nowrap bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4">Add New Location</button>

            <button className="flex flex-row gap-2 items-center text-nowrap bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4">Add New Location</button>
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
              <th className="px-0 py-2 md:px-4">Name</th>
              <th className="pr-2 py-2 md:px-4"></th>
            </tr>
          </thead>
          <tbody className='text-center'>
            {locations.map(location => (
              <React.Fragment key={location.locationID}>
                <tr 
                  className='border-t border-[#E4E7EC] hover:bg-[#F9FAFB] cursor-pointer' 
                  onClick={() => toggleLocationDetails(location.locationID)}
                >
                  <td className="px-0 py-2 md:px-4">
                    <div className="flex items-center gap-2">
                      <img src="./images/map.svg" alt="map icon" className="w-5 h-5" />
                      {location.locationName}
                    </div>
                  </td>
                  <td className="pr-2 py-2 md:px-4 flex flex-row gap-2 my-6 md:my-0 justify-end md:mr-5">
                    <Dialog onOpenChange={(open) => { if (!open) setSelectedLocationID(null); }}>
                      <DialogTrigger asChild>
                        <button
                          className='p-2 rounded m-0 border-2 hover:cursor-pointer hover:border-[#4A1FB8]'
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditLocation(location.locationID);
                          }}
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLocation(location.locationID);
                      }}
                    >
                      <img className="min-w-[16px] min-h-[16px]" src="./images/trash.svg" alt="delete icon" />
                    </button>
                  </td>
                </tr>
                {expandedLocationID === location.locationID && (
                  <tr>
                    <td colSpan="2" className="px-4 py-4 bg-gray-50">
                      <div className="text-left">
                        <h3 className="font-semibold mb-2">Location Details:</h3>
                        {Object.entries(location).map(([key, value]) => {
                          if (key === 'coordinates') {
                            return (
                              <div key={key}>
                                <p>Longitude: {value[0]}</p>
                                <p>Latitude: {value[1]}</p>
                                <p>Manager Name: {(() => {
                                  const employee = employees.find(e => e.employeeID === location.managerID);
                                  return employee ? `${employee.firstName} ${employee.lastName}` : 'N/A';
                                })()}</p>
                              </div>
                            );
                          }
                          return <p key={key}>{key}: {value}</p>;
                        })}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
      <BackToTopButton />
    </div>
  );
};

export default Location;
