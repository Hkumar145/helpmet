import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../api/axios';

const ReportTable = () => {
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees]= useState([]);
  const [reports, setReports]= useState([]);
  const [locationReportCounts, setLocationReportCounts] = useState({});
  const companyID = useSelector((state) => state.user.currentUser?.companyID);

  useEffect(() => {
    if (companyID) {
      axios.get(`/companies/${companyID}/locations`)
        .then(response => {
          console.log("Fetched locations:", response.data); // Log full response
          response.data.forEach(location => {
            console.log("Location Data:", location); // Log each location item
          });
          setLocations(response.data);
        })
        .catch(error => console.error("Error fetching locations:", error));
    }
          // Fetch completed reports count
       axios.get(`/companies/${companyID}/reports`)
          .then(response => {
            const completedReports = response.data;
            const countsByLocation = completedReports.reduce((acc, report) => {
              acc[report.locationID] = (acc[report.locationID] || 0) + 1;
              return acc;
            }, {});
            setLocationReportCounts(countsByLocation);
            setReports(response.data);
          })
          .catch(error => console.error("Error fetching completed reports:", error));
  
        // Fetch employees
       axios.get(`/companies/${companyID}/employees`)
       .then(response => {
         const employees = response.data;
         setEmployees(employees);
       })
       .catch(error => console.error("Error fetching employees:", error));

  }, [companyID]);
  

  return (
    <div className='flex flex-col gap-8'>
      <p className='text-black font-semibold text-lg'>Report Table</p>

      {/* Table: Full Location Collection */}
      <table className='table-auto w-full mt-4 border border-gray-300'>
        <thead>
          <tr className='bg-gray-100'>
            <th className='px-4 py-2 text-left'>Location Name</th>
            <th className='px-4 py-2 text-left'>Site Manager</th>
            <th className='px-4 py-2 text-left'>Number of Injuries</th>
            <th className='px-4 py-2 text-left'>Injury Severity</th>
          </tr>
        </thead>
        <tbody>
  {locations.map(location => (
    <tr key={location._id} className='border-t border-gray-300'>
      <td className='px-4 py-2'>{location.locationName || 'N/A'}</td>
      <td className='px-4 py-2'>{
        (() => {
          const employee = employees.find(e => e.employeeID === location.managerID);
          return employee ? `${employee.firstName} ${employee.lastName}` : 'N/A';
        })()
      }</td>
      <td className='px-4 py-2'>{locationReportCounts[location.locationID] || 0}</td>
      <td className='px-4 py-2'>{
        locationReportCounts[location.locationID] > 15 ? 'Severe' : 'Under Control'
      }</td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default ReportTable;
