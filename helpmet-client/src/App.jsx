import { useState } from 'react'
import ReactApexChart from 'react-apexcharts';
import './App.css'

function App() {
  const [count, setCount] = useState(0);

  const chartOptions = {
    series: [{
      name: "Desktops",
      data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
    }],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: 'straight'
      },
      title: {
        text: 'Product Trends by Month',
        align: 'left'
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
      }
    }
  };

  return (
    <div className="App">
      <h1>ApexCharts in React</h1>
      <ReactApexChart 
        options={chartOptions.options} 
        series={chartOptions.series} 
        type="line" 
        height={350} 
      />
    </div>
  );
}

export default App;
