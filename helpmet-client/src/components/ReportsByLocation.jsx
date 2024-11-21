import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import { Chart, LineElement, Tooltip, Legend } from 'chart.js';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

Chart.register(LineElement, Tooltip, Legend);

const PendingAndCompletedReports = () => {
  const [locationReportCounts, setLocationReportCounts] = useState({});
  const [locations, setLocations] = useState([]);  // State to store location data
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
    }
  }, [companyID]);

  const handleViewCompletedReports = () => {
    navigate(`/report`);
  };

  // Prepare data for the line chart
  const lineChartData = {
    labels: locations.map(location => location.locationName || location.locationID),
    datasets: [
      {
        label: 'Reports by Location',
        data: locations.map(location => locationReportCounts[location.locationID] || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: '#4BC0C0',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const lineChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className='flex flex-col gap-4'>
       
      <div className='flex flex-row items-center justify-between'>
        <p className='text-black'>Reports By Location Summary</p>
      </div>

      <div className='mt-4'>
        <Line data={lineChartData} options={lineChartOptions} />
      </div>
    </div>
    
  );
};

export default PendingAndCompletedReports;
