import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from "axios";
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import { IconButton } from '@mui/material';
import  { useEffect, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { blue, red } from '@mui/material/colors';
import styled from "@emotion/styled";
import { useLocation } from 'react-router-dom';

function createData(id, channel_name, channel_url, created_on, last_modified_on) {
  return { id,channel_name, channel_url, created_on, last_modified_on};
}

const TableRowStyled = styled(TableRow)`
  &:nth-of-type(odd) {
    background-color: lightblue;
  }
  &:nth-of-type(even) {
    background-color: white;
  }
  & > td {
    color: white;
  }`;


function truncate(str) {
  return str.length > 10 ? str.substring(0, 7) + "..." : str;
}

// const rows = [
//   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
//   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
//   createData('Eclair', 262, 16.0, 24, 6.0),
//   createData('Cupcake', 305, 3.7, 67, 4.3),
//   createData('Gingerbread', 356, 16.0, 49, 3.9),
// ];

export default function CommentsTable() {
  
  const location = useLocation();
  const { video_id } = location.state || {};
  const [dataRes, setDataRes]= useState([])
  const [dataResVideos, setDataResVideos]= useState([])
  const [dataResComments, setDataResComments]= useState([])
  
  useEffect (() => {
      // Using fetch to fetch the api from 
      // flask server it will be redirected to proxy
      // console.log("debugging video_id", video_id)
      let authTokens = localStorage.getItem("authToken")
        ? (localStorage.getItem("authToken"))
        : null;
      console.log("Debugging",authTokens)
      // axios({
      //   method: "GET",
      //   url:"http://127.0.0.1:5000/youtube/channels",
      //   headers: { Authorization: `Bearer ${authTokens}` },
      // })
      // .then((response) => {
      //   const res = response.data["youtube channels"]
        
        
      //   setDataRes((Array.isArray(res) ? res: []))
      //   console.log(dataRes)
        
      // }).catch((error) => {
      //   if (error.response) {
      //     console.log(error.response)
      //     console.log(error.response.status)
      //     console.log(error.response.headers)
      //     }
      // })

      // //get Videos
      // console.log("axios")
      // axios({
      //   method: "GET",
      //   url:"http://127.0.0.1:5000/youtube/youtube_video/",
      //   headers: { Authorization: `Bearer ${authTokens}` },
      // })
      // .then((response) => {
      //   const resVideos = response.data
      //   console.log("resVideos")
      //   console.log(resVideos)
      //   setDataResVideos((Array.isArray(resVideos) ? resVideos: []))
      //   console.log(dataResVideos)
        
      // }).catch((error) => {
      //   if (error.response) {
      //     console.log(error.response)
      //     console.log(error.response.status)
      //     console.log(error.response.headers)
      //     }
      // })
      let video_id1 
      // get Comments
      if (!video_id){
        video_id1 = 3
      }else{
        video_id1 =video_id
      }
      
      axios({
        method: "GET",
        url:"http://127.0.0.1:5000/facebook/fblistcomments/" + video_id1,
        headers: { Authorization: `Bearer ${authTokens}` },
      })
      .then((response) => {
        console.log("Debugging, FBPOST", response)
        const resComments = response.data
        
        console.log(resComments)
        setDataResComments((Array.isArray(resComments) ? resComments: []))
        // console.log(dataResComments)
        
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
          }
      })
      
  }, []);
  const primary = red[500]; // #f44336
  const accent = blue[500];

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead className=''>
          <TableRow className='bg-theme-primary'> 
            <TableCell>Id</TableCell>
            <TableCell align="left" >Comment's Name</TableCell>
            <TableCell align="left" >Comment Url</TableCell>
            <TableCell align="left" >comment rating</TableCell>
            <TableCell align="left" >Comment</TableCell>
            
            <TableCell align="left" >Video Published Date</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {dataResComments.map((dataResComments) => (
            <TableRowStyled
            key={dataResComments.review_id}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            
          >
            <TableCell component="th" scope="row">
              {dataResComments.review_id}
            </TableCell>
            <TableCell 
              align="center"
            >
              <p style={{width:50,}}>
                <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {dataResComments.reviewer_name}
                </span>
              </p>   
            </TableCell>
            <TableCell 
              align="center"
              >
              <IconButton
                component="a"
                href={dataResComments.review_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Tooltip  title="Click to redirect" placement="top">
                <InsertLinkIcon sx={{ color: (theme) => theme.palette.mode === 'dark' ? primary : accent }} />
                </Tooltip>
              </IconButton>
            </TableCell>
            <TableCell align="left">
              <p style={{width:70,}}>
              <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {dataResComments.review_rating}
               </span>

              </p>
            </TableCell>
            <TableCell align="left">
              <p style={{width:100, }}>
               <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                {dataResComments.review_text}
               </span> 
              </p>
            </TableCell>
            <TableCell 
              align="center"
            >
              <p style={{width:50, }}>
                <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {new Date(dataResComments.review_date).toLocaleDateString('en-US', {
                    day: 'numeric',    // "20"
                    month: 'numeric',    // "May"
                    year: 'numeric'    // "2023"
                  })}             
                  {/* {dataResComments.review_date} */}
                </span>
              </p>
            </TableCell>
              
            
          </TableRowStyled>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
