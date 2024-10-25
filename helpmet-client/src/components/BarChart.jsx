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
                        return barName[item.label] || item.label;
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
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const chart = elements[0];
                const clickedLabel = chartData.labels[chart.index];
                onBarClick(clickedLabel);
            }
        }
    };

    return (
        <Bar style={{ height: '240px' }} options={options} data={chartData} />
    );
};

export default BarChart;