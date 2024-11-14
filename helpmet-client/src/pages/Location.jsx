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
import CreateLocation from "../components/CreateLocation";
import EditLocation from "../components/EditLocation";
import BackToTopButton from "../components/BackToTopButton";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Location = () => {
  const [locations, setLocations] = useState([]);
  const [selectedLocationID, setSelectedLocationID] = useState(null);
  const [expandedLocationID, setExpandedLocationID] = useState(null);
  const [employees, setEmployees] = useState([]);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState(null);

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

  const handleDeleteLocation = async () => {
    try {
      if (locationToDelete) {
        await axios.delete(`/locations/${locationToDelete}`);
        setLocations((prevLocations) =>
          prevLocations.filter(
            (location) => location.locationID !== locationToDelete
          )
        );
        toast.success(
          `Location with ID ${locationToDelete} deleted successfully`,
          {
            className: "custom-toast",
            bodyClassName: "custom-toast-body",
          }
        );
        setLocationToDelete(null); // Clear after deletion
      }
    } catch (error) {
      toast.error(`Error deleting location: ${error}`, {
        className: "custom-toast-error",
        bodyClassName: "custom-toast-body",
      });
    }
    setConfirmDeleteDialogOpen(false);
  };

  const confirmDelete = (locationID) => {
    setLocationToDelete(locationID);
    setConfirmDeleteDialogOpen(true);
  };

  const toggleLocationDetails = (locationID) => {
    setExpandedLocationID(
      expandedLocationID === locationID ? null : locationID
    );
  };

  return (
    <div className="flex flex-col gap-2 text-black">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-lg font-bold text-black">Locations</h1>
        <Dialog>
          <DialogTrigger asChild>
            <button className="flex flex-row gap-2 items-center text-nowrap bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4">
              Add New Location
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Create New Location</DialogTitle>
            <DialogDescription>
              Add a new location to the system.
            </DialogDescription>
            <CreateLocation />
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        {locations.length === 0 ? (
          <div className="text-center bg-white rounded-lg py-[120px]">
            <p className="font-bold">No Location Available</p>
            <p className="text-sm text-gray-500">
              Start by adding new location to the list
            </p>
          </div>
        ) : (
          <table className="min-w-full bg-white text-black rounded-lg text-sm">
            <thead className="bg-[#f8f8f8] text-left">
              <tr>
                <th className="px-0 py-2 md:px-4">Name</th>
                <th className="pr-2 py-2 md:px-4"></th>
              </tr>
            </thead>
            <tbody className="text-left">
              {locations.map((location) => (
                <React.Fragment key={location.locationID}>
                  <tr
                    className="border-t border-[#E4E7EC] hover:bg-[#F9FAFB] cursor-pointer"
                    onClick={() => toggleLocationDetails(location.locationID)}
                  >
                    <td className="px-0 py-2 md:px-4">
                      <div className="flex items-center gap-2">
                        <img
                          src="./images/map.svg"
                          alt="map icon"
                          className="w-5 h-5"
                        />
                        {location.locationName}
                      </div>
                    </td>
                    <td className="pr-2 py-2 md:px-4 flex flex-row gap-2 my-6 md:my-0 justify-end md:mr-5">
                      <Dialog
                        onOpenChange={(open) => {
                          if (!open) setSelectedLocationID(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <button
                            className="p-2 rounded m-0 border-2 hover:cursor-pointer hover:border-[#4A1FB8]"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditLocation(location.locationID);
                            }}
                          >
                            <img
                              className="min-w-[16px] min-h-[16px]"
                              src="./images/edit.svg"
                              alt="edit icon"
                            />
                          </button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogTitle>Edit Location</DialogTitle>
                          <DialogDescription>
                            Edit location details.
                          </DialogDescription>
                          {selectedLocationID && (
                            <EditLocation
                              locationID={selectedLocationID}
                              onClose={() => setSelectedLocationID(null)}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      <button
                        className="p-2 rounded m-0 border-2 hover:cursor-pointer hover:border-[#4A1FB8]"
                        onClick={(e) => {
                          e.stopPropagation();
                          confirmDelete(location.locationID);
                        }}
                      >
                        <img
                          className="min-w-[16px] min-h-[16px] "
                          src="./images/trash.svg"
                          alt="delete icon"
                        />
                      </button>
                    </td>
                  </tr>
                  {expandedLocationID === location.locationID && (
                    <tr>
                      <td colSpan="2" className="p-4">
                        <div className="bg-white/90 backdrop-blur-lg rounded-xl shadow-sm transition-all duration-300">
                          <h3 className="text-sm font-medium mb-4 text-gray-900">
                            Location Details
                          </h3>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Location Card */}
                            <div className="p-3 rounded-lg bg-gray-50/80 border border-gray-100 hover:shadow-sm transition-all duration-300">
                              <div className="text-xl mb-2">📍</div>
                              <h4 className="text-xs font-medium text-gray-500 mb-1">
                                Location Info
                              </h4>
                              <p className="text-sm font-medium text-gray-900">
                                {location.locationName}
                              </p>
                              <p className="text-xs text-gray-600">
                                ID: {location.locationID}
                              </p>
                            </div>

                            {/* Coordinates Card */}
                            <div className="p-3 rounded-lg bg-gray-50/80 border border-gray-100 hover:shadow-sm transition-all duration-300">
                              <div className="text-xl mb-2">🌍</div>
                              <h4 className="text-xs font-medium text-gray-500 mb-1">
                                Coordinates
                              </h4>
                              <div className="space-y-2">
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {location.coordinates?.[0]}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Longitude
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-900">
                                    {location.coordinates?.[1]}
                                  </p>
                                  <p className="text-xs text-gray-600">
                                    Latitude
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Manager Card */}
                            <div className="p-3 rounded-lg bg-gray-50/80 border border-gray-100 hover:shadow-sm transition-all duration-300">
                              <div className="text-xl mb-2">👤</div>
                              <h4 className="text-xs font-medium text-gray-500 mb-1">
                                Manager
                              </h4>
                              <p className="text-sm font-medium text-gray-900">
                                {(() => {
                                  const employee = employees.find(
                                    (e) => e.employeeID === location.managerID
                                  );
                                  return employee
                                    ? `${employee.firstName} ${employee.lastName}`
                                    : "N/A";
                                })()}
                              </p>
                              <p className="text-xs text-gray-600">
                                ID: {location.managerID}
                              </p>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
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
            Are you sure you want to delete this location?
          </DialogDescription>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setConfirmDeleteDialogOpen(false)}
              className="text-[#98A2B3] hover:text-[#475467] border rounded text-xs px-4 py-2 my-0"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteLocation}
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

export default Location;
