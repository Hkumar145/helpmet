import React, { useState } from 'react';

const CreateEquipment = ({ onSave, onCancel }) => {
  const [equipmentName, setEquipmentName] = useState('');
  const [equipmentID, setEquipmentID] = useState('');
  const [status, setStatus] = useState('Good');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEquipment = { equipmentName, equipmentID, status, description };
    onSave(newEquipment);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-black p-4 rounded">
      <div className="mb-4">
        <label className="block text-sm font-bold">Equipment Name</label>
        <input
          type="text"
          value={equipmentName}
          onChange={(e) => setEquipmentName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Equipment ID</label>
        <input
          type="text"
          value={equipmentID}
          onChange={(e) => setEquipmentID(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        >
          <option value="Good">Good</option>
          <option value="Needs Maintenance">Needs Maintenance</option>
          <option value="Out of Service">Out of Service</option>
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-bold">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="flex justify-between">
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">Save</button>
        <button type="button" onClick={onCancel} className="bg-red-500 text-white px-4 py-2 rounded">Cancel</button>
      </div>
    </form>
  );
};

export default CreateEquipment;
