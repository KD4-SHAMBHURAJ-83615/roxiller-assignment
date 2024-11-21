import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionsTable = ({ month, search, setSearch }) => {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/transactions`, {
          params: { month, search, page, perPage: 10 },
        });
        setTransactions(response.data.transactions);
        setTotalPages(Math.ceil(response.data.total / 10));
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };
    fetchTransactions();
  }, [month, search, page]);

  return (
    <div>
      
      <div className="mb-3  input-box ">
        <input
          type="text"
          className="form-control bg"
          placeholder="Search transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <table className="table table-bordered" >
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Price</th>
            <th>Date of Sale</th>
            <th>Sold</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => (
            <tr key={index}>
              <td>{txn.title}</td>
              <td>{txn.description}</td>
              <td>${txn.price}</td>
              <td>{new Date(txn.dateOfSale).toLocaleDateString()}</td>
              <td>{txn.sold ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-secondary"
          disabled={page <= 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <button
          className="btn btn-secondary"
          disabled={page >= totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
