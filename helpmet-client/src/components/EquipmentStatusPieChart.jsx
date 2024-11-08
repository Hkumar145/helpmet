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
      const response = await axios.get(`http://localhost:5001/companies/${companyID}/equipments`);
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
    <div className="w-full max-w-sm mx-auto p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-center text-lg-16 font-semibold mb-4">Equipment Status Projection</h3>
      <div className="relative h-72 w-72 mx-auto">
        <Doughnut
          data={statusData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '50%', // Makes it look like a ring/doughnut
            plugins: {
              legend: {
                display: true,
                position: 'bottom',
                labels: {
                  boxWidth: 15,
                  font: {
                    size: 14,
                    family: 'sans-serif',
                  },
                },
              },
              tooltip: {
                callbacks: {
                  label: (tooltipItem) => {
                    return `${tooltipItem.label}: ${tooltipItem.raw} equipments`;
                  },
                },
              },
            },
          }}
        />
      </div>
      <p className="text-center mt-4 text-sm text-gray-500">October 2024</p>
    </div>
  );
};

export default EquipmentStatusPieChart;