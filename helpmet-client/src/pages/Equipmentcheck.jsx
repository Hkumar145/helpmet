import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import EquipmentList from '../components/EquipmentList';
import CreateEquipment from '../components/CreateEquipment';

const companyID = 100001; // Declare the company ID

const EquipmentCheck = () => {
  const [equipments, setEquipments] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'create'

  const fetchEquipments = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/companies/${companyID}/equipments`);
      setEquipments(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  const handleCreateEquipment = async (newEquipment) => {
    try {
      await axios.post(`http://localhost:5001/companies/${companyID}/equipments`, newEquipment);
      fetchEquipments(); // Refresh list after creating
      setViewMode('list');
    } catch (error) {
      console.error('Error creating equipment:', error);
    }
  };

  const handleUpdateEquipment = async (updatedEquipment) => {
    try {
      await axios.put(`http://localhost:5001/companies/${companyID}/equipments/${updatedEquipment._id}`, updatedEquipment);
      fetchEquipments();
    } catch (error) {
      console.error('Error updating equipment:', error);
    }
  };

  // const handleDeleteEquipment = async (id) => {
  //   try {
  //     await axios.delete(`http://localhost:5001/companies/${companyID}/equipments/${equipments._id}`);
  //     fetchEquipments();
  //   } catch (error) {
  //     console.error('Error deleting equipment:', error);
  //   }
  // };
  // Updated handleDelete function
// const handleDeleteEquipment = async (id) => {
//   if (!id) {
//     console.error('Equipment ID is undefined');
//     return;
//   }

//   try {
//     const response = await axios.delete(`http://localhost:5001/companies/10001/equipments/${_id}`);
//     if (response.status === 200) {
//       // Refetch equipment list after deletion
//       fetchEquipments();
//     } else {
//       console.error('Failed to delete equipment:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Error deleting equipment:', error);
//   }
// };

// const handleDeleteEquipment = async (equipmentID) => {
//   if (!equipmentID) {
//     console.error('Equipment ID is undefined');
//     return;
//   }

//   try {
//     const response = await axios.delete(`http://localhost:5001/companies/10001/equipments/${equipmentID}`);
//     if (response.status === 200) {
//       // Refetch equipment list after deletion
//       fetchEquipments();
//     } else {
//       console.error('Failed to delete equipment:', response.statusText);
//     }
//   } catch (error) {
//     console.error('Error deleting equipment:', error);
//   }
// };

const handleDeleteEquipment = async (equipmentID) => {
  try {
    const response = await axios.delete(`http://localhost:5001/companies/10001/equipments/${equipmentID}`);
    if (response.status === 200) {
      fetchEquipments(); // Refetch equipment list after deletion
    } else {
      console.error('Failed to delete equipment:', response.statusText);
    }
  } catch (error) {
    console.error('Error deleting equipment:', error);
  }
};


// <button onClick={() => handleDeleteEquipment(equipment.equipmentID)} className="bg-red-500 text-white px-4 py-1 rounded">
//   Delete
// </button>
<button onClick={() => handleDeleteEquipment(equipments.equipmentID)} className="bg-red-500 text-white px-4 py-1 rounded">
  Delete
</button>




  return (
    <div className="equipment-check">
      <h1 className="text-2xl font-semibold text-white mb-4">Equipment Check</h1>
      {viewMode === 'list' ? (
        <div>
          <button
            onClick={() => setViewMode('create')}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Add New Equipment
          </button>
          <EquipmentList
            equipments={equipments}
            onUpdate={handleUpdateEquipment}
            onDelete={handleDeleteEquipment}
          />
        </div>
      ) : (
        <CreateEquipment
          onSave={handleCreateEquipment}
          onCancel={() => setViewMode('list')}
        />
      )}
    </div>
  );
};

export default EquipmentCheck;
