import React, { useState, useEffect } from 'react';
import { Doughnut } from 'react-chartjs-2';
import axios from '../api/axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const EquipmentStatusPieChart = ({ companyID }) => {
  const [statusData, setStatusData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetchEquipmentData();
  }, []);

  const fetchEquipmentData = async () => {
    try {
      const response = await axios.get(`https://helpmet-backend.onrender.com/companies/${companyID}/equipments`);
      processStatusData(response.data);
    } catch (error) {
      console.error('Error fetching equipment data:', error);
    }
  };

  const processStatusData = (data) => {
    const statusCounts = data.reduce((acc, equipment) => {
      acc[equipment.status] = (acc[equipment.status] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(statusCounts);
    const counts = Object.values(statusCounts);

    setStatusData({
      labels,
      datasets: [
        {
          data: counts,
          backgroundColor: ['#4A1FB8', '#D9D6FE','#9B8AFB'],
          hoverBackgroundColor: ['#4A1FB8','#D9D6FE','#9B8AFB'], // Slightly darker versions for hover
          borderWidth: 0, // No border to create a flat modern look
        },
      ],
    });
  };

  return (
      <div className="relative h-[280px] w-[370px] mx-auto">
        <Doughnut
          data={statusData}
          className='max-w-[396px]'
          options={{
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
                text: 'Equipment Status Projection',
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
                    return `${tooltipItem.label}: ${tooltipItem.raw} equipments`;
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
          }}
        />
      </div>
  );
};

export default EquipmentStatusPieChart;