import React, { useEffect, useRef } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
import { Chart } from 'chart.js/auto'; // Importing Chart.js

const Analytics = () => {
  const barChartRef = useRef(null);   // Reference for bar chart
  const doughnutChartRef = useRef(null);  // Reference for doughnut chart

  // Data for Bar Chart
  const barData = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Data for Doughnut Chart
  const doughnutData = {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [{
      label: 'My First Dataset',
      data: [300, 50, 100],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)'
      ],
      hoverOffset: 4
    }]
  };

  // Chart.js configuration for both charts
  const barChartConfig = {
    type: 'bar',
    data: barData,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  const doughnutChartConfig = {
    type: 'doughnut',
    data: doughnutData,
    options: {
      responsive: true,
    },
  };

  // Creating the charts when the component mounts
  useEffect(() => {
    const barCtx = barChartRef.current.getContext('2d');
    new Chart(barCtx, barChartConfig); // Render bar chart

    const doughnutCtx = doughnutChartRef.current.getContext('2d');
    new Chart(doughnutCtx, doughnutChartConfig); // Render doughnut chart
  }, []);

  return (
    <>
      {/* Leaflet Map */}
      <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{ height: '400px', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer>

      {/* Chart.js Bar Graph */}
      <div style={{ width: '600px', margin: '20px auto' }}>
        <canvas ref={barChartRef}></canvas>
      </div>

      {/* Chart.js Doughnut Graph */}
      <div style={{ width: '600px', margin: '20px auto' }}>
        <canvas ref={doughnutChartRef}></canvas>
      </div>
    </>
  );

  
}

export default Analytics;
