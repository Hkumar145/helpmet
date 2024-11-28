import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { useSelector } from 'react-redux'
import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";

const UpdateEquipment = ({ isOpen, equipment, onSave, onCancel }) => {
  const [equipmentName, setEquipmentName] = useState('');
  const [description, setDescription] = useState('');
  const [locationID, setLocationID] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionInterval, setInspectionInterval] = useState('');
  const [inspectedBy, setInspectedBy] = useState('');
  const [status, setStatus] = useState('Good');
  const [isChecked, setIsChecked] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  // const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const companyID = 100001;

  useEffect(() => {
    if (equipment) {
      setEquipmentName(equipment.equipmentName);
      setDescription(equipment.description);
      setLocationID(equipment.locationID);
      setInspectionDate(equipment.inspectionDate);
      setInspectionInterval(equipment.inspectionInterval);
      setInspectedBy(equipment.inspectedBy);
      setStatus(equipment.status);
      setIsChecked(equipment.isChecked ?? false);
    }

    fetchEmployees();
    fetchLocations();
  }, [equipment]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`https://helpmet-backend.onrender.com/companies/${companyID}/employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`https://helpmet-backend.onrender.com/companies/${companyID}/locations`);
      setLocations(response.data);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedEquipment = {
      ...equipment,
      equipmentName,
      description,
      locationID,
      inspectionDate,
      inspectionInterval,
      inspectedBy,
      status,
      isChecked,
    };
    onSave(updatedEquipment);
  };

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onCancel}>
      {/* Overlay with a dark background */}
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black bg-opacity-75 transition-opacity" />
      
      {/* Dialog Content */}
      <DialogPrimitive.Content className="fixed inset-0 flex items-center justify-center p-6">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg md:w-2/3 lg:w-1/2 h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-semibold mb-4 text-center">Update Equipment</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Equipment Name */}
            <div className="flex flex-col">
              <label className="text-gray-600">Equipment Name</label>
              <input
                type="text"
                value={equipmentName}
                onChange={(e) => setEquipmentName(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg"
                placeholder="Enter equipment name"
                required
              />
            </div>

            {/* Description */}
            <div className="flex flex-col">
              <label className="text-gray-600">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg"
                placeholder="Enter equipment description"
                rows="2"
                required
              ></textarea>
            </div>

            {/* Location and Status in one row, stacks vertically in mobile view */}
            <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <div className="flex flex-col md:w-1/2">
                <label className="text-gray-600">Location</label>
                <select
                  value={locationID}
                  onChange={(e) => setLocationID(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  required
                >
                  <option value="">Select Location</option>
                  {locations.map((location) => (
                    <option key={location.locationID} value={location.locationID}>
                      {location.locationName}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col md:w-1/2">
                <label className="text-gray-600">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="border border-gray-300 p-2 rounded-lg w-full"
                >
                  <option value="Good">Good</option>
                  <option value="Needs Maintenance">Needs Maintenance</option>
                  <option value="Out of Service">Out of Service</option>
                </select>
              </div>
            </div>

            {/* Inspection Date and Interval, stacks vertically in mobile view */}
            <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
              <div className="flex flex-col md:w-1/2">
                <label className="text-gray-600">Inspection Date</label>
                {/* <input
                  type="date"
                  value={inspectionDate}
                  onChange={(e) => setInspectionDate(e.target.value)}
                  className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-500 w-full"
                  required
                /> */}
                <DateTimePicker
                  className="injury-datetime-picker"
                  onChange={setInspectionDate}
                  value={inspectionDate}
                  required
                  disableClock={true}
                  clearIcon={null}
                  calendarIcon={null}
                  format='y-MM-dd'
                  maxDate={new Date()}
                />
              </div>
              <div className="flex flex-col md:w-1/2">
                <label className="text-gray-600">Inspection Interval (Days)</label>
                <input
                  type="number"
                  value={inspectionInterval}
                  onChange={(e) => setInspectionInterval(e.target.value)}
                  placeholder="Enter interval"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  required
                />
              </div>
            </div>

            {/* Inspected By */}
            <div className="flex flex-col">
              <label className="text-gray-600">Inspected By</label>
              <select
                value={inspectedBy}
                onChange={(e) => setInspectedBy(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg w-full"
                required
              >
                <option value="">Select Employee</option>
                {employees.map((employee) => (
                  <option key={employee.employeeID} value={employee.employeeID}>
                    {employee.firstName} {employee.lastName} ({employee.role})
                  </option>
                ))}
              </select>
            </div>

            {/* Checked */}
            <div className="flex items-center mt-4">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => setIsChecked(e.target.checked)}
                className="mr-2 mt-1 accent-[#4A1FB8]"
                style={{ width: '2rem', height: '2rem' }}
                required
              />
              <label className="text-gray-600 text-xs">
                By checking this box, I confirm that the information entered is accurate. I understand that any inaccuracies could impact safety and have serious consequences.
              </label>
            </div>

            {/* Buttons */}
            <div className="flex flex-row justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={onCancel}
                className="text-[#98A2B3] hover:text-[#475467] border rounded text-xs px-4 py-2 my-0"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-[#6938EF] text-white font-bold hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded my-0 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </DialogPrimitive.Content>
    </DialogPrimitive.Root>
  );
};

export default UpdateEquipment;
