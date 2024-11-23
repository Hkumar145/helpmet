import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from '../api/axios';
import Avatar from 'react-avatar'
import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

const ReportTable = () => {
  const [locations, setLocations] = useState([]);
  const [employees, setEmployees]= useState([]);
  const [reports, setReports]= useState([]);
  const [locationReportCounts, setLocationReportCounts] = useState({});
  const [highSeverityCounts, setHighSeverityCounts] = useState({});
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
            const highSeverityCountByLocation = completedReports.reduce((acc, report) => {
              if (report.severity === 1) {
                acc[report.locationID] = (acc[report.locationID] || 0) + 1;
              }
              return acc;
            }, {});
            setLocationReportCounts(countsByLocation);
            setHighSeverityCounts(highSeverityCountByLocation);
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
    <div className='flex flex-col items-center justify-center overflow-x-scroll'>
      <p className='text-black font-bold text-sm text-center mt-4 mb-2'> Site Injury Report Table</p>

      {/* Table: Full Location Collection */}
      <table className='table-auto w-full border text-xs'>
        <thead>
          <tr className='bg-FFFFFF-100 rounded-lg font-bold'>
            <td className='px-12 py-2 text-left first:rounded-tl-lg last:rounded-tr-lg'>Location Name</td>
            <td className='px-4 py-2 text-center'>From Date</td>
            <td className='px-4 py-2 text-center'>To Date</td>
            <td className='px-4 py-2 text-center'>Site Manager</td>
            <td className='px-4 py-2 text-center'>High Severity</td>
            <td className='px-4 py-2 text-center'>Total</td>
            <td className='px-4 py-2 text-center'>Injury Severity</td>
          </tr>
        </thead>
        <tbody>
  {locations.map(location => (
    <tr 
      key={location._id} 
      className={`border-t border-gray-300 ${
        locationReportCounts[location.locationID] > 20 ? 'bg-[#FFF3F4]' : 'bg-[#D9FFEC]'
      }`}
    >
      <td className='px-12 py-2 text-left'>{location.locationName || 'N/A'}</td>
      {/* Get the first report for the current location and extract dateOfInjury */}
      <td className='px-4 py-2 text-center'>{
        (() => {
          const report = reports.find(r => r.locationID === location.locationID);
          return report ? new Date(report.dateOfInjury).toLocaleDateString() : 'N/A';
        })()
      }</td>
      <td className='px-4 py-2 text-center'>{new Date(new Date().setDate(new Date().getDate())).toLocaleDateString() || 'N/A'}</td>
   
      <td className='px-4 py-2 text-center'>{
        (() => {
          const employee = employees.find(e => e.employeeID === location.managerID);
          return employee ? (
            <Avatar
              name={`${employee.firstName} ${employee.lastName}`}
              round={true}
              size="30" 
              textSizeRatio={1.75}
              data-tooltip-id={`tooltip-${employee.employeeID}`}
              data-tooltip-content={`${employee.firstName} ${employee.lastName}`}
              style={{ cursor: 'default' }}
              color="#05603A"
            />
          ) : 'N/A';
        })()
      }</td>
      <td className='px-4 py-2 text-center'>{highSeverityCounts[location.locationID] || 0}</td>
      <td className='px-4 py-2 text-center'>{locationReportCounts[location.locationID] || 0}</td>
      <td className='px-4 py-2 text-center'>
        <div className="flex justify-center">
          {locationReportCounts[location.locationID] > 20 ? (
            <img src="/images/severe.svg" alt="Severe" />
          ) : (
            <img src="/images/safe.svg" alt="Safe" />
          )}
        </div>
      </td>
    </tr>
  ))}
</tbody>

      </table>
    </div>
  );
};

export default ReportTable;
