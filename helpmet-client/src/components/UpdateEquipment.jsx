// import React, { useState, useEffect } from 'react';

// const UpdateEquipment = ({ equipment, onSave, onCancel }) => {
//   const [equipmentName, setEquipmentName] = useState('');
//   const [locationID, setLocationID] = useState('');
//   const [inspectionDate, setInspectionDate] = useState('');
//   const [inspectionInterval, setInspectionInterval] = useState('');
//   const [inspectedBy, setInspectedBy] = useState('');
//   const [status, setStatus] = useState('Good');
//   const [description, setDescription] = useState('');
//   const [isChecked, setIsChecked] = useState(false);

//   useEffect(() => {
//     if (equipment) {
//       // Pre-fill the form with the existing equipment data
//       setEquipmentName(equipment.equipmentName);
//       setLocationID(equipment.locationID);
//       setInspectionDate(equipment.inspectionDate);
//       setInspectionInterval(equipment.inspectionInterval);
//       setInspectedBy(equipment.inspectedBy);
//       setStatus(equipment.status);
//       setDescription(equipment.description);
//       setIsChecked(equipment.isChecked);
//     }
//   }, [equipment]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     const updatedEquipment = {
//       ...equipment, // Maintain the existing equipment data
//       equipmentName,
//       locationID,
//       inspectionDate,
//       inspectionInterval,
//       inspectedBy,
//       status,
//       description,
//       isChecked,
//     };
//     onSave(updatedEquipment); // Pass updated equipment to the parent component for saving
//   };

//   return (
//     <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
//       <h2 className="text-2xl font-semibold mb-4 text-gray-800">Update Equipment</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Equipment Name */}
//         <div className="flex flex-col">
//           <label className="text-gray-600">Equipment Name</label>
//           <input
//             type="text"
//             value={equipmentName}
//             onChange={(e) => setEquipmentName(e.target.value)}
//             placeholder="Enter equipment name"
//             className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         {/* Location ID */}
//         <div className="flex flex-col">
//           <label className="text-gray-600">Location ID</label>
//           <input
//             type="text"
//             value={locationID}
//             onChange={(e) => setLocationID(e.target.value)}
//             placeholder="Enter location ID"
//             className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         {/* Inspection Date */}
//         <div className="flex flex-col">
//           <label className="text-gray-600">Inspection Date</label>
//           <input
//             type="date"
//             value={inspectionDate}
//             onChange={(e) => setInspectionDate(e.target.value)}
//             className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         {/* Inspection Interval */}
//         <div className="flex flex-col">
//           <label className="text-gray-600">Inspection Interval (Days)</label>
//           <input
//             type="number"
//             value={inspectionInterval}
//             onChange={(e) => setInspectionInterval(e.target.value)}
//             placeholder="Enter inspection interval"
//             className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         {/* Inspected By */}
//         <div className="flex flex-col">
//           <label className="text-gray-600">Inspected By (Employee ID)</label>
//           <input
//             type="text"
//             value={inspectedBy}
//             onChange={(e) => setInspectedBy(e.target.value)}
//             placeholder="Enter employee ID"
//             className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             required
//           />
//         </div>

//         {/* Status */}
//         <div className="flex flex-col">
//           <label className="text-gray-600">Status</label>
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//           >
//             <option value="Good">Good</option>
//             <option value="Needs Maintenance">Needs Maintenance</option>
//             <option value="Out of Service">Out of Service</option>
//           </select>
//         </div>

//         {/* Description */}
//         <div className="flex flex-col">
//           <label className="text-gray-600">Description</label>
//           <textarea
//             value={description}
//             onChange={(e) => setDescription(e.target.value)}
//             placeholder="Enter equipment description"
//             className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//             rows="4"
//             required
//           ></textarea>
//         </div>

//         {/* Is Checked */}
//         <div className="flex items-center">
//           <input
//             type="checkbox"
//             checked={isChecked}
//             onChange={(e) => setIsChecked(e.target.checked)}
//             className="mr-2"
//           />
//           <label className="text-gray-600">Checked</label>
//         </div>

//         {/* Buttons */}
//         <div className="flex space-x-4">
//           <button
//             type="submit"
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Save Changes
//           </button>
//           <button
//             type="button"
//             onClick={onCancel}
//             className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
//           >
//             Cancel
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default UpdateEquipment;





import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const UpdateEquipment = ({ equipment, onSave, onCancel }) => {
  const [equipmentName, setEquipmentName] = useState('');
  const [locationID, setLocationID] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionInterval, setInspectionInterval] = useState('');
  const [inspectedBy, setInspectedBy] = useState('');
  const [status, setStatus] = useState('Good');
  const [description, setDescription] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [locations, setLocations] = useState([]);
  const companyID = 100001;

  useEffect(() => {
    if (equipment) {
      // Pre-fill the form with the existing equipment data
      setEquipmentName(equipment.equipmentName);
      setLocationID(equipment.locationID);
      setInspectionDate(equipment.inspectionDate.split('T')[0]);
      setInspectionInterval(equipment.inspectionInterval);
      setInspectedBy(equipment.inspectedBy);
      setStatus(equipment.status);
      setDescription(equipment.description);
      setIsChecked(equipment.isChecked);
    }

    fetchEmployees();
    fetchLocations();
  }, [equipment]);

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/companies/${companyID}/employees`);
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/companies/${companyID}/locations`);
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
      locationID,
      inspectionDate,
      inspectionInterval,
      inspectedBy,
      status,
      description,
      isChecked,
    };
    onSave(updatedEquipment);
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Update Equipment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Equipment Name */}
        <div className="flex flex-col">
          <label className="text-gray-600">Equipment Name</label>
          <input
            type="text"
            value={equipmentName}
            onChange={(e) => setEquipmentName(e.target.value)}
            placeholder="Enter equipment name"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label className="text-gray-600">Location</label>
          <select
            value={locationID}
            onChange={(e) => setLocationID(e.target.value)}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Inspection Date */}
        <div className="flex flex-col">
          <label className="text-gray-600">Inspection Date</label>
          <input
            type="date"
            value={inspectionDate}
            onChange={(e) => setInspectionDate(e.target.value)}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Inspection Interval */}
        <div className="flex flex-col">
          <label className="text-gray-600">Inspection Interval (Days)</label>
          <input
            type="number"
            value={inspectionInterval}
            onChange={(e) => setInspectionInterval(e.target.value)}
            placeholder="Enter inspection interval"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Inspected By */}
        <div className="flex flex-col">
          <label className="text-gray-600">Inspected By</label>
          <select
            value={inspectedBy}
            onChange={(e) => setInspectedBy(e.target.value)}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        {/* Status */}
        <div className="flex flex-col">
          <label className="text-gray-600">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Good">Good</option>
            <option value="Needs Maintenance">Needs Maintenance</option>
            <option value="Out of Service">Out of Service</option>
          </select>
        </div>

        {/* Description */}
        <div className="flex flex-col">
          <label className="text-gray-600">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter equipment description"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            required
          ></textarea>
        </div>

        {/* Is Checked */}
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isChecked}
            onChange={(e) => setIsChecked(e.target.checked)}
            className="mr-2"
          />
          <label className="text-gray-600">Checked</label>
        </div>

        {/* Buttons */}
        <div className="flex space-x-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEquipment;
