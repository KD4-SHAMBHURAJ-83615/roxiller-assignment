import React from 'react';

const months = [
  'January', 'February', 'March', 'April', 'May',
  'June', 'July', 'August', 'September', 'October', 'November', 'December',
];

const Dropdown = ({ month, setMonth }) => {
  return (
    <div className="mb-3 input-box">
      <label htmlFor="month" className="form-label">Select Month:</label>
      <select
        id="month"
        className="form-select bg"
        value={month}
        onChange={(e) => setMonth(e.target.value)} 
      >
        {months.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
