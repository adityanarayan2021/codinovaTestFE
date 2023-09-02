import React, { useEffect, useState } from 'react';
import ExchangeTable from './exchangeTable';
import TablePagination from '@mui/material/TablePagination';
import TextField from '@mui/material/TextField';

const ExchangePage = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchQuery, setSearchQuery] = useState('');
  const [exchangesData, setExchangesData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [showTable, setShowTable] = useState(false);
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleUpdateExchanges = () => {
    fetch('http://localhost:3000/updateExchanges', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if(data?.code===200){
        setShowTable(true);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

  };

  
  useEffect(() => {
    fetch(`http://localhost:3000/getAllExchanges?page=${page}&limit=${rowsPerPage+(page * rowsPerPage)}`,
    { method: "GET",
      mode: 'cors',
       headers: {
          'Access-Control-Allow-Origin':'*',
         'Content-Type': 'application/json',}})
      .then((response) => response.json())
      .then((data) => {
        setTotalCount(data?.currentData);
        setExchangesData(data?.exchanges);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [page, rowsPerPage, showTable]);

  useEffect(() => {
    fetch(`http://localhost:3000/exchanges/search?keyword=${searchQuery}&page=${page}&limit=${rowsPerPage+(page * rowsPerPage)}`,
    { method: "GET",
      mode: 'cors',
       headers: {
          'Access-Control-Allow-Origin':'*',
         'Content-Type': 'application/json',}})
      .then((response) => response.json())
      .then((data) => {
        setTotalCount(data?.currentData);
        setExchangesData(data?.results);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [page, rowsPerPage, searchQuery]);

  
  const filteredData = exchangesData?.filter((exchange) =>
    exchange?.name?.toLowerCase()?.includes(searchQuery.toLowerCase())
  );
  const startIndex = page * rowsPerPage;
  const endIndex = rowsPerPage+startIndex;
  const slicedData = filteredData?.slice(startIndex, endIndex);

  return (
    <>
      {showTable &&<TextField
        label="Search Exchange"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchInputChange}
        fullWidth
        margin="normal"
      />}
      {!showTable&& <button onClick={handleUpdateExchanges}>Update Exchanges</button>}

      {showTable && <ExchangeTable data={slicedData} />}
     {showTable && <TablePagination
        component="div"
        count={totalCount}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />}
    </>
  );
};

export default ExchangePage;
