import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import Avatar from 'react-avatar';
import axios from '../api/axios';

const EquipmentList = ({ equipments, onView, onUpdate, onDelete }) => {
  const [expandedEquipmentID, setExpandedEquipmentID] = useState(null);
  const [updatedEquipments, setUpdatedEquipments] = useState([]);
  const [employeeNames, setEmployeeNames] = useState({});
  const [loading, setLoading] = useState(true);

  // Calculate if inspection is due and add a warning flag
  useEffect(() => {
    const calculateInspectionWarnings = () => {
      const currentDate = new Date();
      const updatedList = equipments.map((equipment) => {
        const inspectionDate = new Date(equipment.inspectionDate);
        const inspectionInterval = equipment.inspectionInterval;
        const nextInspectionDate = new Date(inspectionDate);
        nextInspectionDate.setDate(inspectionDate.getDate() + inspectionInterval);

        if (currentDate > nextInspectionDate) {
          return { ...equipment, isInspectionDue: true };
        } else {
          return { ...equipment, isInspectionDue: false };
        }
      });
      setUpdatedEquipments(updatedList);
      setLoading(false);
    };

    calculateInspectionWarnings();
  }, [equipments]);

  // Fetch employee names
  useEffect(() => {
    const fetchEmployeeNames = async () => {
      const uniqueEmployeeIds = [...new Set(equipments.map((e) => e.inspectedBy))];
      const employeeData = {};

      try {
        for (const employeeId of uniqueEmployeeIds) {
          const response = await axios.get(`http://localhost:5001/employees/${employeeId}`);
          if (response.status === 200) {
            employeeData[employeeId] = response.data.firstName;
          }
        }
        setEmployeeNames(employeeData);
      } catch (error) {
        console.error('Error fetching employee names:', error);
      }
    };

    if (equipments.length > 0) {
      fetchEmployeeNames();
    }
  }, [equipments]);

  // Function to format date in dd/mm/yyyy format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleDetails = (equipmentID) => {
    if (expandedEquipmentID === equipmentID) {
      setExpandedEquipmentID(null); // Collapse if clicked again
    } else {
      setExpandedEquipmentID(equipmentID); // Expand to show details
    }
  };

  const handleUpdate = (equipment) => {
    setExpandedEquipmentID(null); // Clear the expanded details when navigating to update
    onUpdate(equipment);
  };

  return (
    <div style={{ marginTop: '0px' }}>
      {loading ? (
        <p className='text-center mt-6 max-w-[710px] min-w-full'>Loading...</p>
      ) : updatedEquipments.length === 0 ? (
        <div className="text-center bg-white rounded-lg py-[120px]">
          <p className="font-bold">No Equipment Available</p>
          <p className="text-sm text-gray-500">Start by adding new equipment to the list</p>
        </div>
      ) : (
      <table
        style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px', color: '#333' }}
        className="equipment-table"
      >
        <thead>
          <tr style={{ backgroundColor: '#f8f8f8', textAlign: 'center' }}>
            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Equipment Name</th>
            <th style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>Equipment ID</th>
            <th
              style={{ padding: '12px', borderBottom: '1px solid #ddd' }}
              className="hide-on-mobile"
            >
              Status
            </th>
            <th
              style={{ padding: '12px', borderBottom: '1px solid #ddd' }}
              className="hide-on-mobile"
            >
              Inspection Date
            </th>
            <th
              style={{ padding: '12px', borderBottom: '1px solid #ddd' }}
              className="hide-on-mobile"
            >
              Inspection Interval
            </th>
            <th
              style={{ padding: '12px', borderBottom: '1px solid #ddd' }}
              className="hide-on-mobile"
            >
              Inspected By
            </th>
            <th style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
              
            </th>
          </tr>
        </thead>
        <tbody>
          {updatedEquipments.map((equipment) => (
            <React.Fragment key={equipment.equipmentID}>
              <tr style={{ borderBottom: '1px solid #ddd' }}>
                <td style={{
                    padding: '12px',
                    height: '100%',
                    display: 'table-cell',
                    verticalAlign: 'middle',
                    textAlign: 'center'
                  }}>
                  <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    {equipment.isInspectionDue && (
                      <FaExclamationTriangle color="red" style={{ marginRight: '8px' }} title="Inspection overdue" />
                    )}
                    {equipment.equipmentName}
                  </div>
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>{equipment.equipmentID}</td>
                <td
                  style={{ padding: '12px', textAlign: 'center', color: equipment.status === 'Out of Order' ? 'red' : 'green' }}
                  className="hide-on-mobile"
                >
                  {equipment.status}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }} className="hide-on-mobile">
                  {formatDate(equipment.inspectionDate)}
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }} className="hide-on-mobile">
                  {equipment.inspectionInterval} days
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }} className="hide-on-mobile">
                    <Avatar
                      name={employeeNames[equipment.inspectedBy] || ''}
                      round={true}
                      size="30"
                      textSizeRatio={1.75}
                      style={{ cursor: 'default', backgroundColor: '#B0B0B0' }}
                      title={employeeNames[equipment.inspectedBy] || 'Unknown'}
                      color="#05603A"
                    />
                </td>
                <td style={{ padding: '12px', textAlign: 'center' }}>
                  <button onClick={() => toggleDetails(equipment.equipmentID)} style={{ marginRight: '10px', cursor: 'pointer' }}
                    className='border-2 hover:cursor-pointer hover:border-[#4A1FB8]'
                  >
                    <img src={expandedEquipmentID === equipment.equipmentID ? "./images/collapse-arrow.svg" : "./images/down-arrow.svg"} alt="Toggle Details" style={{ width: '20px' }} />
                  </button>
                  <button onClick={() => handleUpdate(equipment)} style={{ marginRight: '10px', cursor: 'pointer' }}
                    className='border-2 hover:cursor-pointer hover:border-[#4A1FB8]'
                  >
                    <img className="min-w-[16px] min-h-[16px]" src="./images/edit.svg" alt="edit icon" />
                  </button>
                  <button onClick={() => onDelete(equipment.equipmentID)} style={{ cursor: 'pointer' }}
                    className='border-2 hover:cursor-pointer hover:border-[#4A1FB8]'
                  >
                    <img className="min-w-[16px] min-h-[16px]" src="./images/trash.svg" alt="delete icon" />
                  </button>
                </td>
              </tr>
              {expandedEquipmentID === equipment.equipmentID && (
                <tr className='relative -top-1 border-b border-gray-200'>
                  <td colSpan="7" className="px-6 py-4">
                    <div className="bg-white w-full">
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* First Row */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-500">Equipment Name</div>
                          <div className="font-semibold text-gray-900">{equipment.equipmentName}</div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-500">Equipment ID</div>
                          <div className="font-semibold text-gray-900">{equipment.equipmentID}</div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-500">Location ID</div>
                          <div className="font-semibold text-gray-900">{equipment.locationID}</div>
                        </div>

                        {/* Second Row */}
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-500">Status</div>
                          <div className="font-semibold text-gray-900 flex items-center">
                            <span className={`w-2 h-2 rounded-full mr-2 ${
                              equipment.status.toLowerCase() === 'good' ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></span>
                            {equipment.status}
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-500">Inspection Date</div>
                          <div className="font-semibold text-gray-900">{formatDate(equipment.inspectionDate)}</div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3">
                          <div className="text-sm text-gray-500">Inspection Interval</div>
                          <div className="font-semibold text-gray-900">{equipment.inspectionInterval} days</div>
                        </div>
                      </div>

                      {/* Description - Full Width */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <div className="text-sm text-gray-500">Description</div>
                        <div className="font-semibold text-gray-900">{equipment.description}</div>
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

      <style jsx>{`
        @media (max-width: 768px) {
          .hide-on-mobile {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default EquipmentList;

