// src/Callback.js
import React, { useState } from "react";
import { extCompanyAuthTwitter } from "../API/api";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { STATE_VERIFIER_STORE } from "../utils/constant";


class TWTCallback extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      message: "Authenticating...",
    };
  }

  componentDidMount()
  {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("debugging", urlParams)
    console.log(urlParams.getAll);
    const code = urlParams.get("code");
    const state = urlParams.get("state");
    console.log("code", code)
    const product_url = localStorage.getItem("product_url")
    const product_id = localStorage.getItem("product_id")
    //localStorage.getItem("product_id")
    const page_name = localStorage.getItem("page_name")
    
    if(!state)
    {
      console.log("state variable missing")
      this.setState({ message: "state variable missing" });
    } 

    // const code_verifier = STATE_VERIFIER_STORE[state]
    const code_verifier = sessionStorage.getItem(`twitter_verifier_${state}`);

    // const code_verifier = sessionStorage.getItem("tw_code_verifier");
    const tw_state = sessionStorage.getItem("tw_state");
    console.log("debugging1");

    
    if (!page_name)
      {
          console.log("There is no page name")

          
      }
    if(!product_url)
      {
          console.log("there is no product url")
          
      }
      // if(data_source_id){
      //   console.log("There is no data source name")
      //   navigate('/dashboard');
      // }  


    const inputData = {
        "code": code,
        "data_source_id":8487,
        "product_id": product_id,
        "product_url":product_url,
        "page_name":page_name,
        "code_verifier":code_verifier

      }
    console.log("inputData", inputData)

    if (code) {

      // if (!this._requestSent) {
      //   this._requestSent = true;
        extCompanyAuthTwitter(inputData)
        .then((res) => {
          console.log("Access Token:", res.data.access_token);
          this.setState({ message: "Authentication successful!" });
          this.props.navigate("/reg_prdt_success")
          // Optionally store the token in localStorage
        })
        .catch((err) => {
          console.error(err);
          this.setState({ message: "error" });
          // this.props.navigate("/regproduct")
        });
      // }
      // else{
      //   console.log("API call Already sent  ")
        

      // }
    } else {
      this.setState({ message: "No code in URL." });
    }
  }

  render() {
    return <p>{this.state.message}</p>;
  }
}

export default function TWTCallbackWrapper(props) {
  const navigate = useNavigate();
  return <TWTCallback {...props} navigate={navigate} />;
}

// function TWTCallback() {
//   console.log("debugging1");
//   const navigate = useNavigate();
//   const [message, setMessage] = useState("Processing...");

//   const url = new URL(window.location.href);
//   const code = url.searchParams.get("code");
//   const state =url.searchParams.get("state");
//   const product_id = 1  
//   //const product_id = localStorage.getItem("product_id")
//   const data_source_id = 8487 
//   const product_url = localStorage.getItem("product_url")
//   // we can get from localstorage
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
//         "page_name":page_name,
//         "code_verifier":code_verifier
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


//   return <div>{message}</div>;
// }

// export default TWTCallback;
