// src/Callback.js
import React, { useState } from "react";
import { extCompanyAuthTwitter } from "../API/api";

function TwitterCallback() {
  console.log("debugging1")
  const [message, setMessage] = useState("Processing...");

  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  const state =url.searchParams.get("state");
  const product_id = 1  // get from localStorage
  //const product_id = localStorage.getItem("product_id")
  const data_source_id = 8487// get from 
  const product_url = localStorage.getItem("product_url") // we can get from localstorage
  const page_name = localStorage.getItem("page_name")
  const code_verifier = sessionStorage.getItem("tw_code_verifier");
  const tw_state = sessionStorage.getItem("tw_state");
  if(!state)
  {
    console.log("state variable missing")
    setMessage("state variable missing")
    navigate("/regProduct")
  }
  else
  {
    if(state === tw_state)
    {
      console.log("Not authourizing Peron.Code Mismatching")
      setMessage("Not authourizing Peron.Code Mismatching")
      navigate("/regProduct")
    }
    
  }


  
  if (!page_name)
    {
        console.log("There is no page name")

        navigate('/dashboard');
    }
  if(!product_url)
    {
        console.log("there is no product url")
        navigate('/dashboard');
    }
    // if(data_source_id){
    //   console.log("There is no data source name")
    //   navigate('/dashboard');
    // }  

  const inputData = {
        "code": code,
        "data_source_id":7066,//data_source_id
        "product_id":product_id,
        "product_url":product_url,
        "page_name":page_name,
        "code_verifier":code_verifier

  }
  const sendCodeToBackend = async () => {
    try {   
        extCompanyAuthTwitter(inputData)
        .then((res) => {
          console.log("responseTwitter Access_token", res)
          setMessage({ message: "Authentication successful!" });
          sessionStorage.removeItem("tw_state")
          sessionStorage.removeItem("tw_code_verifier")
          // Optionally store the token in localStorage
        })
        .catch((err) => {
          console.error(err);
          setMessage({ message: "Authentication failed." });
          sessionStorage.removeItem("tw_state")
          sessionStorage.removeItem("tw_code_verifier")
        });
    } catch (err) {
      console.error(err);
      setMessage("Failed to log in.");
      sessionStorage.removeItem("tw_state")
      sessionStorage.removeItem("tw_code_verifier")
    }
  };

  if (code && code_verifier) {
    setMessage("authentication is processing")
    sendCodeToBackend();
  }else{
    setMessage("No code in URL")
  }

  return <div>{message}</div>;
}

export default TwitterCallback;


//  const url = new URL(window.location.href);
//   const code = url.searchParams.get("code");
//   const state =url.searchParams.get("state");
//   const product_id = 1  
//   //const product_id = localStorage.getItem("product_id")
//   const data_source_id = 8487 
//   const product_url = localStorage.getItem("product_url")
// // we can get from localstorage
//   const page_name = localStorage.getItem("page_name")
//   const code_verifier = sessionStorage.getItem("tw_code_verifier");
//   const tw_state = sessionStorage.getItem("tw_state");
//   console.log("debugging1");

//   if(!state)
//   {
//     console.log("state variable missing")
//     setMessage("state variable missing")
//     navigate("/regProduct")
//   }
//   else
//   {
//     if(state === tw_state)
//     {
//       console.log("Not authourizing Peron.Code Mismatching")
//       setMessage("Not authourizing Peron.Code Mismatching")
//       navigate("/regProduct")
//     }
    
//   }


  
//   if (!page_name)
//     {
//         console.log("There is no page name")

//         navigate('/dashboard');
//     }
//   if(!product_url)
//     {
//         console.log("there is no product url")
//         navigate('/dashboard');
//     }
//     // if(data_source_id){
//     //   console.log("There is no data source name")
//     //   navigate('/dashboard');
//     // }  

//   const inputData = {
//         "code": code,
//         "data_source_id":7066,//data_source_id
//         "product_id":product_id,
//         "product_url":product_url,
//         "page_name":page_name
//   }
//   const sendCodeToBackend = async () => {
//     try {   
//         extCompanyAuthTwitter(inputData)
//         .then((res) => {
//           console.log("responseTwitter Access_token", res)
//           setMessage({ message: "Authentication successful!" });
//           // Optionally store the token in localStorage
//         })
//         .catch((err) => {
//           console.error(err);
//           setMessage({ message: "Authentication failed." });
//         });
//     } catch (err) {
//       console.error(err);
//       setMessage("Failed to log in.");
//     }
//   };

//   if (code && code_verifier) {
//     setMessage("authentication is processing")
//     sendCodeToBackend();
//   }else{
//     setMessage("No code in URL")
//   }