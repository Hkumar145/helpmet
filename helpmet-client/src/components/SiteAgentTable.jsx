import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

const PendingAndCompletedReports = () => {
  // State to store report counts by location
  const [locationReportCounts, setLocationReportCounts] = useState({});
  
  // State to store location data
  const [locations, setLocations] = useState([]);
  
  // State to store employees data
  const [employees, setEmployees] = useState([]);
  
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const navigate = useNavigate();

  useEffect(() => {
    if (companyID) {
      // Fetch completed reports count
      axios.get(`/companies/${companyID}/reports`)
        .then(response => {
          const completedReports = response.data;

          // Count reports by location
          const countsByLocation = completedReports.reduce((acc, report) => {
            acc[report.locationID] = (acc[report.locationID] || 0) + 1;
            return acc;
          }, {});

          setLocationReportCounts(countsByLocation);
        })
        .catch(error => console.error("Error fetching completed reports:", error));

      // Fetch locations
      axios.get(`/companies/${companyID}/locations`) // Update this endpoint to match your API
        .then(response => {
          setLocations(response.data); // Assuming this returns an array of location objects
        })
        .catch(error => console.error("Error fetching locations:", error));

      // Fetch employees
      axios.get(`/companies/${companyID}/employees`) // Update this endpoint to match your API
        .then(response => {
          setEmployees(response.data); // Assuming this returns an array of employee objects
        })
        .catch(error => console.error("Error fetching employees:", error));
    }
  }, [companyID]);

  const handleViewCompletedReports = () => {
    navigate(`/report`);
  };

  // Create a memoized map of employeeID to employee data for quick lookup
  const employeeMap = useMemo(() => {
    const map = {};
    employees.forEach(employee => {
      map[employee.employeeID] = employee;
    });
    return map;
  }, [employees]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <p className='text-black font-semibold text-lg'>Reports By Location Summary</p>
        <button 
          onClick={handleViewCompletedReports}
          className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
        >
          View Completed Reports
        </button>
      </div>

      <table className='table-auto w-full mt-4 border border-gray-300'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='px-4 py-2 text-left'>Location Name</th>
            <th className='px-4 py-2 text-left'>Number of Reports</th>
            <th className='px-4 py-2 text-left'>Manager First Name</th>
            <th className='px-4 py-2 text-left'>Manager Last Name</th>
          </tr>
        </thead>
        <tbody>
          {locations.map(location => {
            const manager = employeeMap[location.managerID];
            return (
              <tr key={location.locationID} className='border-t border-gray-300'>
                <td className='px-4 py-2'>{location.locationName || location.locationID}</td>
                <td className='px-4 py-2'>{locationReportCounts[location.locationID] || 0}</td>
                <td className='px-4 py-2'>{employees ? employees.firstName : 'N/A'}</td>
                <td className='px-4 py-2'>{manager ? manager.lastName : 'N/A'}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default PendingAndCompletedReports;
