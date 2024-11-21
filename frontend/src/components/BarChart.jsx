import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register the components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = ({ month }) => {
  const [barData, setBarData] = useState([]);

  useEffect(() => {
    const fetchBarData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bar-chart`, { params: { month } });
        setBarData(response.data);
      } catch (error) {
        console.error('Error fetching bar chart data:', error);
      }
    };
    fetchBarData();
  }, [month]);

  const data = {
    labels: barData.map((item) => item.range),
    datasets: [
      {
        label: 'Number of Items',
        data: barData.map((item) => item.count),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="card1 p-3">
      <h5 className="text-center">Bar Chart Stats - {month} </h5>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
