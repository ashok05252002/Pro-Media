// src/Callback.js
import React, { useState } from "react";
import { extCompanyAuthLinkedin, extCompanyAuthTwitter } from "../API/api";
import { useSearchParams, useNavigate } from 'react-router-dom';
import { STATE_VERIFIER_STORE } from "../utils/constant";


class LinkedInCallback extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      message: "Authenticating...",
      once:false
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
    const storedState = sessionStorage.getItem('linkedin_oauth_state');
    if (state !== storedState) {
      this.setState({
        loading: false,
        error: 'State mismatch. Possible CSRF attack.'
      });
      return;
    }  

    const inputData = {
        "code": code,
        "data_source_id":7668,
        "product_id": product_id,
        "product_url":product_url,
        "page_name":page_name,

      }
    console.log("inputData", inputData)

    if (code) {

      // if (!this._requestSent) {
      //   this._requestSent = true;
      if(!(this.state.once)){
        extCompanyAuthLinkedin(inputData)
        .then((res) => {
          console.log("Access Token:", res.data.access_token);
          this.setState({ message: "Authentication successful!", once:true });
          this.props.navigate("/reg_prdt_success")
          // Optionally store the token in localStorage
        })
        .catch((err) => {
          console.error(err);
          this.setState({ message: "error" });
          // this.props.navigate("/regproduct")
        });
    }
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

export default function LinkedInCallbackWrapper(props) {
  const navigate = useNavigate();
  return <LinkedInCallback {...props} navigate={navigate} />;
}