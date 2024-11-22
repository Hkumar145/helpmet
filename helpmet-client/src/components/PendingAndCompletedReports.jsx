import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
import MapComponent from './MapComponent';

ChartJS.register(ArcElement, Tooltip, Legend);

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
        data: [ongoingReportsCount, onHoldReportsCount, completedReportsCount],
        backgroundColor: ['#D9D6FE', '#9B8AFB', '#4A1FB8'], // Rotated colors for 3
        hoverBackgroundColor: ['#D9D6FE', '#9B8AFB', '#4A1FB8'], // Slightly darker versions for hover
        borderWidth: 0, // No border to create a flat modern look
      },
    ],
  };

  const options = {
    responsive: true,
    layout: {
      padding: {
        top: 20,
        bottom: 20,
        right: 20,
      },
    },
    maintainAspectRatio: false,
    cutout: '50%', // Makes it look like a ring/doughnut
    plugins: {
      title: {
        display: true,
        text: 'Reports Status Projection',
        font: {
          family: 'Fira Sans, sans-serif',
          size: 18,
        },
        color: '#000000',
      },
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          boxWidth: 15,
          font: {
            size: 14,
            family: 'Fira Sans, sans-serif',
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.label}: ${tooltipItem.raw} reports`;
          },
        },
        titleFont: {
          family: 'Fira Sans, sans-serif',
        },
        bodyFont: {
          family: 'Fira Sans, sans-serif',
        },
      },
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
      <div className="relative h-[280px] w-[370px] mx-auto">
        <Doughnut
          data={data}
          className='max-w-[396px]'
          options={options}
        />
      </div>
  );
};

export default PendingAndCompletedReports;
