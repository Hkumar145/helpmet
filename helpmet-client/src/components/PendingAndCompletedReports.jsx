import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import MapComponent from './MapComponent';

Chart.register(ArcElement, Tooltip, Legend);

const PendingAndCompletedReports = () => {
  const [onHoldReportsCount, setOnHoldReportsCount] = useState(0);
  const [ongoingReportsCount, setOngoingReportsCount] = useState(0);
  const [completedReportsCount, setCompletedReportsCount] = useState(0);
  const [locationReportCounts, setLocationReportCounts] = useState({});
  const [locations, setLocations] = useState([]);
  const companyID = useSelector((state) => state.user.currentUser?.companyID);
  const navigate = useNavigate();

  useEffect(() => {
    if (companyID) {
      // Fetch pending reports count
      axios.get(`/companies/${companyID}/reports/pending`).then(response => {
        const pendingReports = response.data;
        setOngoingReportsCount(pendingReports.filter(report => report.status === 'On going').length);
        setOnHoldReportsCount(pendingReports.filter(report => report.status === 'On hold').length);
      }).catch(error => console.error("Error fetching pending reports:", error));

      // Fetch completed reports count
      axios.get(`/companies/${companyID}/reports`).then(response => {
        const completedReports = response.data;
        setCompletedReportsCount(completedReports.length);
        setLocationReportCounts(completedReports.reduce((acc, report) => {
          acc[report.locationID] = (acc[report.locationID] || 0) + 1;
          return acc;
        }, {}));
      }).catch(error => console.error("Error fetching completed reports:", error));

      // Fetch locations
      axios.get(`/companies/${companyID}/locations`).then(response => {
        setLocations(response.data);
      }).catch(error => console.error("Error fetching locations:", error));
    }
  }, [companyID]);

  const data = {
    labels: ['Ongoing', 'On Hold', 'Completed'],
    datasets: [
      {
        label: 'Reports Status',
        data: [ongoingReportsCount, onHoldReportsCount, completedReportsCount],
        backgroundColor: ['#9B8AFB', '#D9D6FE', '#4A1FB8'],
        hoverBackgroundColor: ['#9B8AFB', '#D9D6FE', '#4A1FB8'],
      },
    ],
  };

  const options = {
    responsive: true,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
      },
    },
    plugins: {
      title: {
        display: true,
        text: 'Reports Summary',
        font: {
          family: 'Fira Sans, sans-serif',
          size: 18,
        },
        color: '#000000',
      },
      legend: {
        position: 'bottom',
        labels: {
          font: {
            family: 'Fira Sans, sans-serif',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          }
        },
        titleFont: {
          family: 'Fira Sans, sans-serif',
        },
        bodyFont: {
          family: 'Fira Sans, sans-serif',
        },
      }
    },
    onClick: (e, elements) => {
      if (elements.length > 0) {
        const clickedIndex = elements[0].index;
        if (clickedIndex === 0) {
          navigate('/pending-report'); // Ongoing reports
        } else if (clickedIndex === 1) {
          navigate('/pending-report'); // On Hold reports
        } else if (clickedIndex === 2) {
          navigate('/report'); // Completed reports
        }
      }
    }
  };

  return (
    <div className='flex flex-col gap-4'>
      <Doughnut data={data} options={options} style={{ maxHeight: '300px', minWidth: '396px' }} />
    </div>
  );
  
  
};

export default PendingAndCompletedReports;
