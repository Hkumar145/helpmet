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

const BarChart = ({ chartData, barName, title, onBarClick, indexAxis }) => {
    const options = {
        responsive: true,
        layout: {
            padding: {
                left: 40,
                right: 40,
            },
        },
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: title,
                color: 'black',
                font: {
                    family: 'Fira Sans, sans-serif',
                    size: 18,
                },
                padding: {
                    top: 30,
                    bottom: 4
                }
            },
            tooltip: {
                callbacks: {
                    title: (tooltipItems) => {
                        const item = tooltipItems[0];
                        return barName ? barName[item.label] || item.label : item.label;
                    },
                    label: (tooltipItem) => {
                        const count = tooltipItem.raw;
                        return count <= 1 ? `${count} Injury` : `${count} Injuries`;
                    },
                },
                titleFont: {
                    family: 'Fira Sans, sans-serif',
                },
                bodyFont: {
                    family: 'Fira Sans, sans-serif',
                },
                displayColors: false
            },
        },
        indexAxis: indexAxis,
        scales: {
            x: {
                ticks: {
                    color: 'black',
                    beginAtZero: true,  
                    stepSize: 10,
                    font: {
                        family: 'Fira Sans, sans-serif',
                    }
                },
                grid: {
                    display: false,
                },
            },
            y: {
                ticks: {
                    display: false,    
                    beginAtZero: true,  
                    stepSize: 1
                },
                grid: {
                    display: false,
                },
            },
        },
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const chart = elements[0];
                const clickedLabel = chartData.labels[chart.index];
                onBarClick(clickedLabel);
            }
        },
    };

    return (
        <Bar style={{ height: '240px' }} options={options} data={chartData} />
    );
};

export default BarChart;