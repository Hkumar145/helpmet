import React, { useState, useEffect } from 'react';
import { FaEye, FaEdit, FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import Avatar from 'react-avatar';
import axios from '../api/axios';

const EquipmentList = ({ equipments, onView, onUpdate, onDelete }) => {
  const [expandedEquipmentID, setExpandedEquipmentID] = useState(null);
  const [updatedEquipments, setUpdatedEquipments] = useState([]);
  const [employeeNames, setEmployeeNames] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculateInspectionWarnings = () => {
      const currentDate = new Date();
      const updatedList = equipments.map((equipment) => {
        const inspectionDate = new Date(equipment.inspectionDate);
        const inspectionInterval = equipment.inspectionInterval;
        const nextInspectionDate = new Date(inspectionDate);
        nextInspectionDate.setDate(inspectionDate.getDate() + inspectionInterval);

        return {
          ...equipment,
          isInspectionDue: currentDate > nextInspectionDate,
        };
      });
      setUpdatedEquipments(updatedList);
      setLoading(false);
    };

    calculateInspectionWarnings();
  }, [equipments]);

  useEffect(() => {
    const fetchEmployeeNames = async () => {
      const uniqueEmployeeIds = [...new Set(equipments.map((e) => e.inspectedBy))];
      const employeeData = {};

      try {
        for (const employeeId of uniqueEmployeeIds) {
          const response = await axios.get(`https://helpmet-backend.onrender.com/employees/${employeeId}`);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const toggleDetails = (equipmentID) => {
    setExpandedEquipmentID(expandedEquipmentID === equipmentID ? null : equipmentID);
  };

  const handleUpdate = (equipment) => {
    setExpandedEquipmentID(null);
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
        <div style={{ overflowX: 'auto', width: '100%' }}>
          {/* <table
            style={{ width: '100%', borderCollapse: 'collapse', fontSize: '16px', color: '#333' }}
            className="equipment-table"
          > */}
           <table className="w-full bg-white text-black mt-0 rounded-lg text-xs">
            {/* <thead>
              <tr style={{ backgroundColor: '#f8f8f8', textAlign: 'center', }}>
              <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #ddd' }}>
  <div style={{ marginLeft: '5vw' }}>Equipment Name</div>
</th>

                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #ddd' }}>Equipment ID</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #ddd' }} className="hide-on-mobile">Status</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #ddd' }} className="hide-on-mobile">Inspection Date</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #ddd' }} className="hide-on-mobile">Inspection Interval</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #ddd' }} className="hide-on-mobile">Inspected By</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #ddd' }}></th>
              </tr>
            </thead> */}
            <thead>
              <tr style={{ backgroundColor: '#f8f8f8', textAlign: 'center' }}>
                <th style={{ padding: '16px', textAlign: 'left', borderBottom: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  <div style={{ marginLeft: '5vw' }}>Equipment Name</div>
                </th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Equipment ID</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="hide-on-mobile">Status</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="hide-on-mobile">Inspection Date</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="hide-on-mobile">Inspection Interval</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="hide-on-mobile">Inspected By</th>
                <th style={{ padding: '16px', textAlign: 'center', borderBottom: '1px solid #ddd', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}></th>
              </tr>
            </thead>
            <tbody>
              {updatedEquipments.map((equipment) => (
                <React.Fragment key={equipment.equipmentID}>
                 <tr className="border-t border-[#E4E7EC] hover:bg-[#F9FAFB]">
                 {/* <td style={{ padding: '16px', verticalAlign: 'middle', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      <div style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          marginLeft:'5vw'
                        }}
                      >
                        {equipment.equipmentName}
                        {equipment.isInspectionDue && (
                          <FaExclamationTriangle color="red" style={{ marginLeft: '8px', justifyse:'right'}} title="Inspection overdue" />
                        )}
                      </div>
                    </td> */}
                    <td style={{
                        padding: '16px',
                        verticalAlign: 'middle',
                        textAlign: 'left',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                      <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginLeft: '5vw'
                        }}
                      >
                        <span>{equipment.equipmentName}</span>
                        {equipment.isInspectionDue && (
                          <FaExclamationTriangle color="red" style={{ marginLeft: 'auto', marginRight:'3rem'}} title="Inspection overdue" />
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{equipment.equipmentID}</td>
                    {/* <td style={{ padding: '16px', textAlign: 'center', color: equipment.status === 'Out of Service' ? 'red' : 'green', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="hide-on-mobile">
                        {equipment.status}
                    </td> */}
                    <td style={{ padding: '16px', textAlign: 'center', color: equipment.isInspectionDue ? 'grey' : (equipment.status === 'Out of Service' || equipment.status === 'Needs Maintenance'? 'red' : 'green'), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="hide-on-mobile">
                      {equipment.isInspectionDue ? 'TBC' : equipment.status}
                    </td>

                    <td style={{ padding: '16px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="hide-on-mobile">
                      {formatDate(equipment.inspectionDate)}
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="hide-on-mobile">
                      {equipment.inspectionInterval} days
                    </td>
                    <td style={{ padding: '16px', textAlign: 'center', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} className="hide-on-mobile">
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
                    <td style={{ padding: '16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '12px', justifyContent: 'right', alignItems: 'center', marginRight: '5vw' }}>
                      <button onClick={() => toggleDetails(equipment.equipmentID)} title="View Details"
                        className='border hover:cursor-pointer hover:border-[#4A1FB8] flex justify-center items-center'
                        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0px' }}
                      >
                        <img src={expandedEquipmentID === equipment.equipmentID ? "./images/collapse-arrow.svg" : "./images/down-arrow.svg"} alt="Toggle Details" style={{ maxWidth: '100%' }} />
                      </button>
                      <button onClick={() => handleUpdate(equipment)} title="Edit"
                        className='border hover:cursor-pointer hover:border-[#4A1FB8] flex justify-center items-center'
                        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0px' }}
                      >
                        <img src="./images/edit.svg" alt="edit icon" style={{ maxWidth: '100%' }} />
                      </button>
                      <button onClick={() => onDelete(equipment.equipmentID)} title="Delete"
                        className='border hover:cursor-pointer hover:border-[#4A1FB8] flex justify-center items-center'
                        style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '0px' }}
                      >
                        <img src="./images/trash.svg" alt="delete icon" style={{ maxWidth: '100%' }} />
                      </button>
                    </div>
                  </td>

                  </tr>
                  {expandedEquipmentID === equipment.equipmentID && (
                    <tr className='relative -top-1 border-b border-gray-200'>
                      <td colSpan="7" className="px-6 py-4">
                        <div className="bg-white w-full">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
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
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-sm text-gray-500">Status</div>
                              {/* <div className="font-semibold text-gray-900 flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${equipment.status.toLowerCase() === 'good' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                {equipment.status}
                              </div> */}
                               <div className="font-semibold text-gray-900 flex items-center">
                                <span className={`w-2 h-2 rounded-full mr-2 ${equipment.isInspectionDue ? 'bg-gray-500' : (equipment.status.toLowerCase() === 'good' ? 'bg-green-500' : 'bg-red-500')}`}></span>
                                {equipment.isInspectionDue ? 'TBC' : equipment.status}
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
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-sm text-gray-500">Inspected By</div>
                              <div className="font-semibold text-gray-900">{employeeNames[equipment.inspectedBy] || 'Unknown'}</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-3">
                              <div className="text-sm text-gray-500">Description</div>
                              <div className="font-semibold text-gray-900">{equipment.description || 'N/A'}</div>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
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
