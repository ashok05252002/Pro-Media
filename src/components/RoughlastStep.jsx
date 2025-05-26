import React from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IconButton } from '@mui/material';
import  { useEffect, useState } from 'react';


// const TableRowStyled = styled(TableRow)`
//   &:nth-of-type(odd) {
//     background-color: lightblue;
//   }
//   &:nth-of-type(even) {
//     background-color: grey;
//   }
//   & > td {
//     color: white;
//   }`;

const RegProduct = (props) => {
 
  const [rows, setRows] = useState([
    { id: 1, website: "Facebook", ProductName: "", ProductURL: "" },
    { id: 2, website: "Instagram", ProductName: "", ProductURL: "" },
    { id: 3, website: "Youtube", ProductName: "", ProductURL: "" },
    { id: 4, website: "LinkedIn", ProductName: "", ProductURL: "" },
    { id: 5, website: "Twitter", ProductName: "", ProductURL: "" },
    { id: 6, website: "Amazon", ProductName: "", ProductURL: "" },
    { id: 7, website: "Flipkart", ProductName: "", ProductURL: "" },
    { id: 8, website: "Myntra", ProductName: "", ProductURL: "" },
    
  ]);

  const handleChange = (id, field, value) => {
    const updatedRows = rows.map((row) =>
      row.id === id ? { ...row, [field]: value } : row
    );
    props.handleChange(id, field, value)
    setRows(updatedRows);
  };

  return (
    <div>
      {rows.map((row, index) => (
        <div
          key={row.id}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "15px",
            marginBottom: "15px",
          }}
        >
          {/* Website (fixed) */}
          <div style={{ width: "100px", fontWeight: "bold" }}>{row.website}</div>

          {/* Product Name input */}
          <input
            type="text"
            placeholder="Product Name"
            value={row.productName}
            onChange={(e) =>
              handleChange(row.id, "productName", e.target.value)
            }
            style={{ flex: 1, padding: "8px" }}
          />

          {/* Product URL input */}
          <input
            type="text"
            placeholder="Product URL"
            value={row.productURL}
            onChange={(e) =>
              handleChange(row.id, "productURL", e.target.value)
            }
            style={{ flex: 1, padding: "8px" }}
          />
        </div>
      ))}
    </div>
  );
};
export default RegProduct;
