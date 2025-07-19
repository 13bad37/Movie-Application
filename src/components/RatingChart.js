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

// Register chart components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RatingChart = ({ roles = [] }) => {
  // Build arrays from roles
  const labels = roles.map((role) => role.movieName);
  const dataValues = roles.map((role) =>
    role.imdbRating !== undefined && role.imdbRating !== null ? role.imdbRating : 0
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'IMDb Rating',
        data: dataValues,
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Movie Ratings Over Career' }
    },
    scales: {
      y: { beginAtZero: true, max: 10 }
    }
  };

  return <Bar data={data} options={options} />;
};

export default RatingChart;
