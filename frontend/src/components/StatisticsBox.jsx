import React, { useEffect, useState } from 'react';
import axios from 'axios';

const StatisticsBox = ({ month }) => {
  const [stats, setStats] = useState({ totalSaleAmount: 0, soldItemsCount: 0, unsoldItemsCount: 0 });

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/statistics`, { params: { month } });
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };
    fetchStatistics();
  }, [month]);

  return (
    <div className="row mb-4">
      <h5>Statistics - {month}</h5>
      <div className="col-md-4">
        
        <div className="card p-3 text-center bg">
          <h5>Total Sale   -  ${stats.totalSaleAmount} </h5>
          <h5>Total Sold Items - {stats.soldItemsCount}</h5>
          <h5>Unsold Items  -  {stats.unsoldItemsCount}</h5>
        </div>
      </div>
      
      
    </div>
  );
};

export default StatisticsBox;
