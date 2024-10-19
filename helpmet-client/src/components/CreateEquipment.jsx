import React, { useState } from 'react';

const CreateEquipment = ({ onSave, onCancel }) => {
  const [equipmentName, setEquipmentName] = useState('');
  const [locationID, setLocationID] = useState('');
  const [inspectionDate, setInspectionDate] = useState('');
  const [inspectionInterval, setInspectionInterval] = useState('');
  const [inspectedBy, setInspectedBy] = useState('');
  const [status, setStatus] = useState('Good');
  const [description, setDescription] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [imageURL, setImageURL] = useState(''); // State for image URL

  const handleSave = (e) => {
    e.preventDefault();
    const newEquipment = {
      equipmentName,
      locationID,
      inspectionDate,
      inspectionInterval: parseInt(inspectionInterval),
      inspectedBy: parseInt(inspectedBy),
      status,
      description,
      isChecked,
      imageURL, // Include image URL in the new equipment data
    };

    onSave(newEquipment); // Pass the new equipment data to the onSave function
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">Create New Equipment</h2>
      <form onSubmit={handleSave} className="space-y-4">
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
            type="number"
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
          />
        </div>

        {/* Image URL */}
        <div className="flex flex-col">
          <label className="text-gray-600">Image URL</label>
          <input
            type="text"
            value={imageURL}
            onChange={(e) => setImageURL(e.target.value)}
            placeholder="Enter image URL"
            className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
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
