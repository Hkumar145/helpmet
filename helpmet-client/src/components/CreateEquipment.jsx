import React, { useState } from 'react';
import axios from '../api/axios';

const CreateEquipment = ({ onSave, onCancel }) => {
  const [equipmentName, setEquipmentName] = useState('');
  const [locationID, setLocationID] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionInterval, setInspectionInterval] = useState('');
  const [inspectedBy, setInspectedBy] = useState('');
  const [status, setStatus] = useState('Good');
  const [description, setDescription] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [imageURL, setImageURL] = useState('');
  const [error, setError] = useState('');
  const [equipments, setEquipments] = useState([]);
  const companyID = 100001;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEquipment = {
      equipmentName,
      locationID,
      inspectionDate,
      inspectionInterval,
      inspectedBy,
      status,
      description,
      isChecked,
    };
    handleCreateEquipment(newEquipment);
  };

  const fetchEquipments = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/companies/${companyID}/equipments`);
      setEquipments(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setError('Error fetching equipment');
    }
  };

  const handleCreateEquipment = async (newEquipment) => {
    try {
      const response = await axios.post(`http://localhost:5001/companies/${companyID}/equipments`, newEquipment);
      if (response.status === 200 || response.status === 201) {
        onSave();
        onCancel();
      } else {
        console.error("Error creating equipment:", response.statusText);
        setError('Error creating equipment');
      }
    } catch (error) {
      console.error("Error creating equipment:", error.response ? error.response.data : error.message);
      setError('Error creating equipment');
      onSave();
      onCancel();
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create New Equipment</h2>
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

        {/* Location ID */}
        <div className="flex flex-col">
          <label className="text-gray-600">Location ID</label>
          <input
            type="text"
            value={locationID}
            onChange={(e) => setLocationID(e.target.value)}
            placeholder="Enter location ID"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
          <label className="text-gray-600">Inspected By (Employee ID)</label>
          <input
            type="text"
            value={inspectedBy}
            onChange={(e) => setInspectedBy(e.target.value)}
            placeholder="Enter employee ID"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
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
            Save
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

export default CreateEquipment;

// import React, { useState } from 'react';

// const CreateEquipment = ({ onSave, onCancel }) => {
//   const [equipmentName, setEquipmentName] = useState('');
//   const [locationID, setLocationID] = useState('');
//   const [inspectionDate, setInspectionDate] = useState('');
//   const [inspectionInterval, setInspectionInterval] = useState('');
//   const [inspectedBy, setInspectedBy] = useState('');
//   const [isChecked, setIsChecked] = useState(false);
//   const [status, setStatus] = useState('Good');
//   const [description, setDescription] = useState('');
//   const [image, setImage] = useState(''); // State for image URL

//   const handleSave = () => {
//     const newEquipment = {
//       equipmentName,
//       locationID,
//       inspectionDate,
//       inspectionInterval: parseInt(inspectionInterval),
//       inspectedBy: parseInt(inspectedBy),
//       isChecked,
//       status,
//       description,
//       image, // Include the image URL in the new equipment data
//     };

//     onSave(newEquipment); // Call the onSave function passed as a prop
//   };

//   return (
//     <div className="create-equipment-form bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
//       <h2 className="text-xl font-semibold mb-4">Create New Equipment</h2>

//       {/* Equipment Name */}
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Equipment Name</label>
//         <input
//           type="text"
//           value={equipmentName}
//           onChange={(e) => setEquipmentName(e.target.value)}
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           placeholder="Enter Equipment Name"
//         />
//       </div>

//       {/* Location ID */}
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Location ID</label>
//         <input
//           type="text"
//           value={locationID}
//           onChange={(e) => setLocationID(e.target.value)}
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           placeholder="Enter Location ID"
//         />
//       </div>

//       {/* Inspection Date */}
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Inspection Date</label>
//         <input
//           type="date"
//           value={inspectionDate}
//           onChange={(e) => setInspectionDate(e.target.value)}
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//         />
//       </div>

//       {/* Inspection Interval */}
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Inspection Interval (Days)</label>
//         <input
//           type="number"
//           value={inspectionInterval}
//           onChange={(e) => setInspectionInterval(e.target.value)}
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           placeholder="Enter Inspection Interval"
//         />
//       </div>

//       {/* Inspected By (Employee ID) */}
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Inspected By (Employee ID)</label>
//         <input
//           type="number"
//           value={inspectedBy}
//           onChange={(e) => setInspectedBy(e.target.value)}
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           placeholder="Enter Employee ID"
//         />
//       </div>

//       {/* Is Checked */}
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Is Checked?</label>
//         <input
//           type="checkbox"
//           checked={isChecked}
//           onChange={(e) => setIsChecked(e.target.checked)}
//           className="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//         />
//       </div>

//       {/* Status */}
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Status</label>
//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//         >
//           <option value="Good">Good</option>
//           <option value="Needs Maintenance">Needs Maintenance</option>
//           <option value="Out of Service">Out of Service</option>
//         </select>
//       </div>

//       {/* Description */}
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
//         <textarea
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           placeholder="Enter Description"
//         />
//       </div>

//       {/* Image URL */}
//       <div className="mb-4">
//         <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
//         <input
//           type="text"
//           value={image}
//           onChange={(e) => setImage(e.target.value)}
//           className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//           placeholder="Enter Image URL"
//         />
//       </div>

//       {/* Save and Cancel Buttons */}
//       <div className="flex items-center justify-between">
//         <button
//           onClick={handleSave}
//           className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//         >
//           Save
//         </button>
//         <button
//           onClick={onCancel}
//           className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CreateEquipment;
