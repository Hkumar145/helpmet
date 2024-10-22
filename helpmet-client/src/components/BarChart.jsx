import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const BarChart = ({ chartData, injuryTypeName }) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: false,
            },
            title: {
                display: true,
                text: 'Injury Category Projection',
                color: 'white',
                font: {
                    size: 18,
                },
            },
            tooltip: {
                callbacks: {
                    title: (tooltipItems) => {
                        const item = tooltipItems[0];
                        return injuryTypeName[item.label] || item.label;
                    },
                    label: (tooltipItem) => {
                        const count = tooltipItem.raw;
                        return count <= 1 ? `${count} Injury` : `${count} Injuries`;
                    },
                },
                displayColors: false
            },
        },
        scales: {
            x: {
                ticks: {
                    color: 'white',
                },
                grid: {
                    display: false,
                },
            },
            y: {
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    return (
        <Bar style={{ width: '80%', height: '200px' }} options={options} data={chartData} />
    );
};

export default BarChart;