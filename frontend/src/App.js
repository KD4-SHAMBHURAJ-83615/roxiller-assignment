import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import TransactionsTable from './components/TransactionsTable';
import StatisticsBox from './components/StatisticsBox';
import BarChart from './components/BarChart';
import Dropdown from './components/Dropdown';
import './App.css'
import img from './img/20241121_160643.png'

function App() {
  const [month, setMonth] = useState('March'); 
  const [search, setSearch] = useState(''); 

  return (
    <div className="container ">

      
      <img src={img} alt=""  />

      {/* Month Dropdown */}
      <Dropdown month={month} setMonth={setMonth} />


      {/* Transactions Table Section */}
      <div className="mt-4">
        <TransactionsTable month={month} search={search} setSearch={setSearch} />
      </div>
     

      
      
      <div className="row mt-5 mb-5">

        <div className="col-md-5"> 
         {/* Statistics Section */}
         <StatisticsBox month={month} />
        </div>
        <div className="col-md-6"> 
         {/* Charts Section */}
          <BarChart month={month} />
        </div>
       
        
      </div>
    </div>
  );
}

export default App;
