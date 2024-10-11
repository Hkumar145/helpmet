import React, { useState, useEffect } from 'react';
import axios from '@/api/axios';

const EquipmentCheck = () => {
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from backend API
  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const response = await axios.get('http://localhost:5001/equipments'); // Use your correct backend API URL
        setEquipments(response.data); // Set the equipments data from the response
      } catch (error) {
        setError('Error fetching equipments: ' + error.message); // Handle error
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchEquipments(); // Call the function to fetch data
  }, []);

  // Function to delete an equipment
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/equipments/${id}`); // Adjust your API URL
      setEquipments(equipments.filter(equipment => equipment._id !== id)); // Update the state
    } catch (error) {
      setError('Error deleting equipment: ' + error.message); // Handle error
    }
  };

  if (loading) return <p>Loading equipment data...</p>; // Show loading message
  if (error) return <p>{error}</p>; // Show error message

  return (
    <div>
      <h1 className='text-white'>Equipment List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border border-gray-300 rounded-lg">
        {equipments.length > 0 ? (
          equipments.map((equipment) => (
            <div key={equipment._id} className="bg-gray-800 text-white p-4 rounded-lg shadow-md border border-gray-300">
              <h3>{equipment.equipmentName}</h3>
              <p><strong>ID:</strong> {equipment.equipmentID}</p>
              <p><strong>Location:</strong> {equipment.locationID}</p>
              <p><strong>Inspection Date:</strong> {equipment.inspectionDate}</p>
              <p><strong>Status:</strong> {equipment.status}</p>
              <p><strong>Description:</strong> {equipment.description}</p>
              <button
                onClick={() => handleDelete(equipment._id)} // Call delete function
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No equipment data available.</p>
        )}
      </div>
    </div>
  );
};

export default EquipmentCheck;
