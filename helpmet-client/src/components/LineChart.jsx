import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = ({ chartData, lineName, title, onLineClick, indexAxis }) => {
    const options = {
        responsive: true,
        layout: {
            padding: {
                left: 20,
                right: 20
            },
        },
        plugins: {
            legend: {
                position: false,
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
                    bottom: 30
                }
            },
            tooltip: {
                callbacks: {
                    title: (tooltipItems) => {
                        const item = tooltipItems[0];
                        return lineName[item.label] || item.label;
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
                display: true,
                ticks: {
                    display: false,
                    color: 'black',
                    font: {
                        family: 'Fira Sans, sans-serif',
                    }
                },
                grid: {
                    display: true,
                },
            },
            y: {
                display: false,
                beginAtZero: true,
                ticks: {
                    color: 'white',
                    stepSize: 1,
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
                onLineClick(clickedLabel);
            }
        }
    };

    return (
        <Line style={{ height: '240px' }} options={options} data={chartData} />
    );
};

export default LineChart;
