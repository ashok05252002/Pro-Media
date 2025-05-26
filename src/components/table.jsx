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
import { useNavigate, Link, useLocation} from 'react-router-dom';
import { extCompanyPrdctFBlistVideos, extCompanyPrdctTWTlistVideos,extCompanyProductData
} from '../API/api';


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

export default function BasicTable() {
  const [dataRes, setDataRes]= useState([])
  const [dataResVideos, setDataResVideos]= useState([])
  const [dataResComments, setDataResComments]= useState([])
  const [options, setOptions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("")
  const [selectedItem, setSelectedItem] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();


  let productId = localStorage.getItem("product_id")
  let { platform_name, product_id, ext_prdct_data_source_id } = location.state || {}; // Destructure the same keys
  console.log("localStorageID",productId)
  
  const handleViewComments = (video_id) =>{
    console.log("debugging", video_id)
    navigate ("/ViewComments" ,  { 
                state: { video_id: video_id,},
                replace: true, // Replaces current history entry
            });
  }
  
  const handleDropdownChange = (e) => {
    setSelectedValue(e.target.value);
    const selectedId = e.target.value;
    const selectedObj = options.find(option => option.id.toString() === selectedId);
    setSelectedItem(selectedObj);
    console.log("Selected ID:", selectedObj?.id);
    console.log("Selected Name:", selectedObj?.product_name)
  };
  useEffect (() => {
      // Using fetch to fetch the api from 
      // flask server it will be redirected to proxy
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

      // get Comments
      console.log("debuggong ext_prdct_data_source_id", ext_prdct_data_source_id)
      // if(!ext_prdct_data_source_id)
      // {  
      //   ext_prdct_data_source_id = 7
      // }

      extCompanyProductData()  // testing must use user_id
            .then(response => {
              console.log("debugging1",response)
              if (response.status === ( 200 || 201))
              { 
                console.log("debugging2",response)
                setOptions(response.data);
              }
              else {
                console.log(response)
              }
              })
            .catch(error => {
              console.error("Error fetching data:", error);
            });

      var temp_passing_id 
      if (ext_prdct_data_source_id)
      {
        temp_passing_id -ext_prdct_data_source_id

      } else if(product_id){
        temp_passing_id = product_id
      }
      else if(productId){
        temp_passing_id = productId
      }
      console.log("debuggong ext_prdct_data_source_id", ext_prdct_data_source_id, productId)
      ext_prdct_data_source_id = ext_prdct_data_source_id ?? 7;
      console.log("debuggong ext_prdct_data_source_id", ext_prdct_data_source_id, productId)
      // axios({
      //   method: "GET",
      //   url:"http://127.0.0.1:5000/facebook/fblistposts/" + ext_prdct_data_source_id,
      //   headers: { Authorization: `Bearer ${authTokens}` },
      // })
      platform_name = platform_name ?? "facebook";
      if(platform_name === "facebook")
      {
          extCompanyPrdctFBlistVideos(ext_prdct_data_source_id)
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
        }
        if(platform_name === "twitter")
        {
          extCompanyPrdctTWTlistVideos(ext_prdct_data_source_id)
          .then((response) => {
            console.log("Debugging, FBPOST", response)
            const resTWTComments = response.data
            
            console.log(resTWTComments)
            if(resTWTComments)
            {  
              setDataResComments((Array.isArray(resTWTComments) ? resTWTComments: []))
            }
            else{
              console.log("There is no record")
            }
            // console.log(dataResComments)
            
          }).catch((error) => {
            if (error.response) {
              console.log(error.response)
              console.log(error.response.status)
              console.log(error.response.headers)
              }
          })
        }
      }, []);
  const primary = red[500]; // #f44336
  const accent = blue[500];

  return (
    <div>
       <div className="space-y-8">
            <label>Register Product Name: </label>
            <select style={{marginLeft:'30px', width:"20%"}} defaultValue="" onChange={handleDropdownChange}>
                <option value="">-- Select --</option>
                {options?.map(option => (
                  <option key={option?.id} value={option?.id}>
                    {option?.product_name}
                  </option>
                ))}
            </select>
        </div>  
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead className=''>
            <TableRow style={{backgroundColor:"#f44336"}}> 
              <TableCell>Id</TableCell>
              <TableCell align="left" >V Title</TableCell>
              <TableCell align="left" >V Url</TableCell>
              <TableCell align="left" >Likes Count</TableCell>
              <TableCell align="left" >Views Count</TableCell>
              
              <TableCell align="left" >Published Date</TableCell>
              <TableCell align="left" >To view comments</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {dataResComments.map((dataResComments) => (
              <TableRowStyled
              key={dataResComments.id}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              
            >
              <TableCell component="th" scope="row">
                {dataResComments.id}
              </TableCell>
              <TableCell 
                align="center"
              >
                <p style={{width:50,}}>
                  <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                    {dataResComments.video_title}
                  </span>
                </p>   
              </TableCell>
              <TableCell 
                align="center"
                >
                <IconButton
                  component="a"
                  href={dataResComments.video_url}
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
                  {dataResComments.likes_count}
                </span>

                </p>
              </TableCell>
              <TableCell align="left">
                <p style={{width:100, }}>
                <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>
                  {dataResComments.views_count}
                </span> 
                </p>
              </TableCell>
              <TableCell 
                align="center"
              >
                <p style={{width:50, }}>
                  <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>             
                    {new Date(dataResComments.video_publish_date).toLocaleDateString('en-US', {
                      day: 'numeric',    // "20"
                      month: 'numeric',    // "May"
                      year: 'numeric'    // "2023"
                    })}
                  </span>
                </p>
              </TableCell>
              <TableCell 
                align="center"
              >
                <p style={{width:50, }}>
                  {/* <span style={{overflow: 'hidden', textOverflow: 'ellipsis'}}>             
                    {dataResComments.video_published_date}
                  </span> */}
                  <button style = {{backgroundColor:"brown", color:"white"}} onClick={()=>handleViewComments(dataResComments.id)}>
                    view comments
                  </button>
                </p>
              </TableCell>
                
              
            </TableRowStyled>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
