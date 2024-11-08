// import React, { useState, useEffect } from 'react';
// import axios from '../api/axios';
// import EquipmentList from '../components/EquipmentList';
// import CreateEquipment from '../components/CreateEquipment';
// import UpdateEquipment from '../components/UpdateEquipment';

// const companyID = 100001; // Declare the company ID

// const EquipmentCheck = () => {
//   const [equipments, setEquipments] = useState([]);
//   const [viewMode, setViewMode] = useState('list'); 
//   const [selectedEquipment, setSelectedEquipment] = useState(null); 

//   const fetchEquipments = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5001/companies/${companyID}/equipments`);
//       setEquipments(response.data);
//     } catch (error) {
//       console.error('Error fetching equipment:', error);
//     }
//   };

//   useEffect(() => {
//     fetchEquipments();
//   }, []);

//   const handleCreateEquipment = async (newEquipment) => {
//     try {
//       await axios.post(`http://localhost:5001/companies/${companyID}/equipments`, newEquipment);
//       fetchEquipments(); // Refresh list after creating
//       setViewMode('list');
//     } catch (error) {
//       console.error('Error creating equipment:', error);
//     }
//   };

//   const handleUpdateEquipment = async (updatedEquipment) => {
//     try {
//       const response = await axios.put(`http://localhost:5001/equipments/${updatedEquipment.equipmentID}`, updatedEquipment);
//       if (response.status === 200) {
//         setEquipments((prevEquipments) => 
//           prevEquipments.map((equipment) => 
//             equipment.equipmentID === updatedEquipment.equipmentID ? updatedEquipment : equipment
//           )
//         );
//         setViewMode('list'); 
//       } else {
//         console.error('Failed to update equipment:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error updating equipment:', error);
//     }
//   };
  

//   const handleEditEquipment = (equipment) => {
//     setSelectedEquipment(equipment);
//     setViewMode('update');
//   };

//   const handleDeleteEquipment = async (equipmentID) => {
//     try {
//       const response = await axios.delete(`http://localhost:5001/equipments/${equipmentID}`);
      
//       if (response.status === 200 || response.status === 204) {
//         console.log('Equipment deleted successfully');
//         await fetchEquipments(); 
//       } else {
//         console.error('Failed to delete equipment:', response.statusText);
//       }
//     } catch (error) {
//       console.error('Error deleting equipment:', error.response ? error.response.data : error.message);
//     }
//   };
  
  

//   return (
//     <div className="equipment-check">
//       <h1 className="text-2xl font-semibold text-white mb-4">Equipment Check</h1>
//       {viewMode === 'list' && (
//         <div>
//           <button
//             onClick={() => setViewMode('create')}
//             className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
//           >
//             Add New Equipment
//           </button>
//           <EquipmentList
//             equipments={equipments}
//             onUpdate={handleEditEquipment} // Passing the equipment to edit
//             onDelete={handleDeleteEquipment}
//           />
//         </div>
//       )}

//       {viewMode === 'create' && (
//         <CreateEquipment
//           onSave={handleCreateEquipment}
//           onCancel={() => setViewMode('list')}
//         />
//       )}

//       {viewMode === 'update' && (
//         <UpdateEquipment
//           equipment={selectedEquipment} 
//           onSave={handleUpdateEquipment}
//           onCancel={() => setViewMode('list')}
//         />
//       )}
//     </div>
//   );
// };

// export default EquipmentCheck;


import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import EquipmentList from '../components/EquipmentList';
import CreateEquipment from '../components/CreateEquipment';
import UpdateEquipment from '../components/UpdateEquipment';
import EquipmentDetail from '../components/EquipmentDetail';
import { useSelector } from 'react-redux'

const companyID = 100001; // Declare the company ID

const EquipmentCheck = () => {
  const [equipments, setEquipments] = useState([]);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'create', or 'update'
  const [selectedEquipment, setSelectedEquipment] = useState(null); // To hold details of the selected equipment
  const [error, setError] = useState(''); // Error state for handling API errors
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  // Fetch all equipments
  const fetchEquipments = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/companies/${companyID}/equipments`);
      setEquipments(response.data);
    } catch (error) {
      console.error('Error fetching equipment:', error);
      setError('Error fetching equipment');
    }
  };

  useEffect(() => {
    fetchEquipments();
  }, []);

  // Handle creating a new equipment
  // const handleCreateEquipment = async (newEquipment) => {
  //   try {
  //     const response = await axios.post(`http://localhost:5001/companies/${companyID}/equipments`, newEquipment);
  //     if (response.status === 200 || response.status === 201) {
  //       fetchEquipments();  // Refresh the equipment list after creating
  //       setViewMode('list'); // Switch back to list view after successful creation
  //     } else {
  //       console.error("Error creating equipment:", response.statusText);
  //       setError('Error creating equipment');
  //     }
  //   } catch (error) {
  //     console.error("Error creating equipment:", error.response ? error.response.data : error.message);
  //     setError('Error creating equipment');
  //   }
  // };

  // Handle updating an existing equipment
  const handleUpdateEquipment = async (updatedEquipment) => {
    try {
      const response = await axios.put(`http://localhost:5001/equipments/${updatedEquipment.equipmentID}`, updatedEquipment);

      if (response.status === 200) {
        // Success, update the equipment list
        setEquipments((prevEquipments) => 
          prevEquipments.map((equipment) => 
            equipment.equipmentID === updatedEquipment.equipmentID ? updatedEquipment : equipment
          )
        );
        setViewMode('list'); // Go back to the list view after successful update
      } else {
        console.error('Failed to update equipment:', response.statusText);
        setError('Error updating equipment');
      }
    } catch (error) {
      console.error('Error updating equipment:', error.message);
      setError('Error updating equipment: ' + error.message);
    }
  };

  // Handle deleting equipment
  const handleDeleteEquipment = async (equipmentID) => {
    try {
      const response = await axios.delete(`http://localhost:5001/companies/${companyID}/equipments/${equipmentID}`);
      if (response.status === 200) {
        fetchEquipments(); // Refetch equipment list after deletion
      } else {
        console.error('Failed to delete equipment:', response.statusText);
        setError('Error deleting equipment');
      }
    } catch (error) {
      console.error('Error deleting equipment:', error);
      setError('Error deleting equipment');
    }
  };

  // Handle viewing equipment details
  const handleViewEquipment = async (equipmentID) => {
    try {
      const response = await axios.get(`http://localhost:5001/equipments/${equipmentID}`);
      if (response.status === 200) {
        setSelectedEquipment(response.data); // Set the selected equipment details
      } else {
        console.error('Failed to fetch equipment details:', response.statusText);
        setError('Error fetching equipment details');
      }
    } catch (error) {
      console.error('Error fetching equipment details:', error);
      setError('Error fetching equipment details');
    }
  };

  const handleEditEquipment = (equipment) => {
    setSelectedEquipment(equipment); // Set the selected equipment to be edited
    setViewMode('update'); // Switch to update mode
  };

  return (
    <div className="equipment-check">
      <h1 className="text-2xl font-semibold text-black mb-4">Equipment Check</h1>
      {viewMode === 'list' ? (
        <div>
          <button
            onClick={() => setViewMode('create')}
            className="bg-[#6938EF] text-white hover:bg-[#D9D6FE] hover:text-[#6938EF] text-xs px-4 py-2 rounded mb-4"
          >
            Add New Equipment
          </button>
          <EquipmentList
            equipments={equipments}
            onUpdate={handleEditEquipment}
            onDelete={handleDeleteEquipment}
            onView={handleViewEquipment} // Pass the view handler
          />
          {selectedEquipment && (
            <EquipmentDetail
              equipment={selectedEquipment}
              onClose={() => setSelectedEquipment(null)} // Close the detail view
              onSave={fetchEquipments}
            />
          )}
        </div>
      ) : viewMode === 'create' ? (
        <CreateEquipment
          onSave={fetchEquipments}
          onCancel={() => setViewMode('list')}
        />
      ) : viewMode === 'update' ? (
        <UpdateEquipment
          equipment={selectedEquipment}
          onSave={handleUpdateEquipment}
          onCancel={() => setViewMode('list')}
        />
      ) : null}
    </div>
  );
};

export default EquipmentCheck;
