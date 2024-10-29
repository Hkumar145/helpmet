import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';  // Import Doughnut from chart.js
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

Chart.register(ArcElement, Tooltip, Legend);  // Register the required elements

const PendingAndCompletedReports = () => {
  const [onHoldReportsCount, setOnHoldReportsCount] = useState(0);
  const [ongoingReportsCount, setOngoingReportsCount] = useState(0);
  const [completedReportsCount, setCompletedReportsCount] = useState(0);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const navigate = useNavigate();

  useEffect(() => {
    if (companyID) {
      // Fetch pending reports count (ongoing and on hold)
      axios.get(`/companies/${companyID}/reports/pending`)
        .then(response => {
          const pendingReports = response.data;
          
          // Filter and count the reports based on status
          const ongoingCount = pendingReports.filter(report => report.status === 'On going').length;
          const onHoldCount = pendingReports.filter(report => report.status === 'On hold').length;

          // Set the state with the respective counts
          setOngoingReportsCount(ongoingCount);
          setOnHoldReportsCount(onHoldCount);
        })
        .catch(error => {
          console.error("Error fetching pending reports:", error);
        });

      // Fetch completed reports count
      axios.get(`/companies/${companyID}/reports`)
        .then(response => {
          setCompletedReportsCount(response.data.length); // Set the completed reports count
        })
        .catch(error => {
          console.error("Error fetching completed reports:", error);
        });
    }
  }, [companyID]);

  const data = {
    labels: ['Ongoing', 'On Hold', 'Completed'],  // Labels for the statuses
    datasets: [
      {
        label: 'Reports Status',
        data: [ongoingReportsCount, onHoldReportsCount, completedReportsCount],  // Data values for the donut graph
        backgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0'],  // Different colors for each section
        hoverBackgroundColor: ['#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const handleViewPendingReports = () => {
    navigate(`/pending-report`);
  };

  const handleViewCompletedReports = () => {
    navigate(`/report`);
  };

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row items-center justify-between'>
        <h1 className='text-white text-2xl'>Reports Summary</h1>
      </div>

      <div className='mt-4'>
        <Doughnut data={data} options={options} /> {/* Chart for showing report statuses */}
      </div>

      <div className='mt-4 flex gap-4'>
        <button
          onClick={handleViewPendingReports}
          className='bg-purple-700 text-white p-3 rounded-lg hover:opacity-90'
        >
          View Pending Reports
        </button>

        <button
          onClick={handleViewCompletedReports}
          className='bg-green-700 text-white p-3 rounded-lg hover:opacity-90'
        >
          View Completed Reports
        </button>
      </div>
    </div>
  );
};

export default PendingAndCompletedReports;
