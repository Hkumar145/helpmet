import React, { useState, useEffect } from 'react';

const UpdateEquipment = ({ equipment, onSave, onCancel }) => {
  const [equipmentName, setEquipmentName] = useState('');
  const [locationID, setLocationID] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionInterval, setInspectionInterval] = useState('');
  const [inspectedBy, setInspectedBy] = useState('');
  const [status, setStatus] = useState('Good');
  const [description, setDescription] = useState('');
  const [isChecked, setIsChecked] = useState(false);

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
  }, [equipment]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedEquipment = {
      ...equipment, // Maintain the existing equipment data
      equipmentName,
      locationID,
      inspectionDate,
      inspectionInterval,
      inspectedBy,
      status,
      description,
      isChecked,
    };
    onSave(updatedEquipment); // Pass updated equipment to the parent component for saving
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



// import React, { useState, useEffect } from 'react';

// const UpdateEquipment = ({ equipment, onSave, onCancel }) => {
//   const [equipmentName, setEquipmentName] = useState(equipment.equipmentName || '');
//   const [locationID, setLocationID] = useState(equipment.locationID || '');
//   const [inspectionDate, setInspectionDate] = useState(equipment.inspectionDate || '');
//   const [inspectionInterval, setInspectionInterval] = useState(equipment.inspectionInterval || '');
//   const [inspectedBy, setInspectedBy] = useState(equipment.inspectedBy || '');
//   const [isChecked, setIsChecked] = useState(equipment.isChecked || false);
//   const [status, setStatus] = useState(equipment.status || 'Good');
//   const [description, setDescription] = useState(equipment.description || '');
//   const [imageURL, setImageURL] = useState(equipment.image || ''); // Initialize with the current image URL

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     const updatedEquipment = {
//       ...equipment,
//       equipmentName,
//       locationID,
//       inspectionDate,
//       inspectionInterval,
//       inspectedBy,
//       isChecked,
//       status,
//       description,
//       image: imageURL, // Add the image URL to the payload
//     };

//     onSave(updatedEquipment);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <div>
//         <label htmlFor="equipmentName">Equipment Name</label>
//         <input
//           type="text"
//           id="equipmentName"
//           value={equipmentName}
//           onChange={(e) => setEquipmentName(e.target.value)}
//         />
//       </div>

//       <div>
//         <label htmlFor="locationID">Location ID</label>
//         <input
//           type="text"
//           id="locationID"
//           value={locationID}
//           onChange={(e) => setLocationID(e.target.value)}
//         />
//       </div>

//       <div>
//         <label htmlFor="inspectionDate">Inspection Date</label>
//         <input
//           type="date"
//           id="inspectionDate"
//           value={inspectionDate}
//           onChange={(e) => setInspectionDate(e.target.value)}
//         />
//       </div>

//       <div>
//         <label htmlFor="inspectionInterval">Inspection Interval (Days)</label>
//         <input
//           type="number"
//           id="inspectionInterval"
//           value={inspectionInterval}
//           onChange={(e) => setInspectionInterval(e.target.value)}
//         />
//       </div>

//       <div>
//         <label htmlFor="inspectedBy">Inspected By (Employee ID)</label>
//         <input
//           type="text"
//           id="inspectedBy"
//           value={inspectedBy}
//           onChange={(e) => setInspectedBy(e.target.value)}
//         />
//       </div>

//       <div>
//         <label htmlFor="imageURL">Image URL</label>
//         <input
//           type="text"
//           id="imageURL"
//           value={imageURL}
//           onChange={(e) => setImageURL(e.target.value)} // Handle image URL update
//         />
//       </div>

//       <div>
//         <label htmlFor="isChecked">Checked</label>
//         <input
//           type="checkbox"
//           id="isChecked"
//           checked={isChecked}
//           onChange={(e) => setIsChecked(e.target.checked)}
//         />
//       </div>

//       <div>
//         <label htmlFor="status">Status</label>
//         <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
//           <option value="Good">Good</option>
//           <option value="Needs Maintenance">Needs Maintenance</option>
//           <option value="Out of Service">Out of Service</option>
//         </select>
//       </div>

//       <div>
//         <label htmlFor="description">Description</label>
//         <textarea
//           id="description"
//           value={description}
//           onChange={(e) => setDescription(e.target.value)}
//         />
//       </div>

//       <button type="submit">Save</button>
//       <button type="button" onClick={onCancel}>Cancel</button>
//     </form>
//   );
// };

// export default UpdateEquipment;
