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
        plugins: {
            legend: {
                position: false,
            },
            title: {
                display: true,
                text: title,
                color: 'white',
                font: {
                    size: 18,
                },
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
                displayColors: false
            },
        },
        indexAxis: indexAxis,
        scales: {
            x: {
                display: true,
                ticks: {
                    color: 'white',
                },
                grid: {
                    display: false,
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