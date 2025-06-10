import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { extCompanyAuthFacebook } from '../API/api';


const FacebookCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  console.log("Debugging FbCallback")
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    // const state = params.get('state');
    const product_id = 1  // get from localStorage
    //const product_id = localStorage.getItem("product_id")
    const data_source_id = 7066// get from 
    const product_url = localStorage.getItem("product_url") // we can get from localstorage
    const page_name = localStorage.getItem("page_name")
    
    console.log("code debugging", code)
    console.log("State Debugging", state)
    console.log("product_url", product_url)
    if  (!product_id){
      console.log("missing Product_id")
    }
    if  (!product_url){
      console.log("missing Product_url")
    }


    if (code) {
      // Exchange code for token with your backend
      console.log('Received code:', code);
    } else {
      console.error('No code received in callback');
    }
    // if (code) {
    //   const userData = {
    //     "code":code,
    //     "product_id": product_id,
    //     "data_source_id":data_source_id,
    //     "product_Url":product_url
    //   }
      // Send the code to your backend to exchange for an access token
      // axios.post(import.meta.env.VITE_BASE_API_URL+'/auth/facebook', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code, product_id, master_data_source_id, product_url}),
      // })

      // extCompanyAuthFacebook(userData)
      //   .then(response => response.json())
      //   .then(data => {
          // Handle the response data
          // For example, store the access token and redirect
          // console.log(data)
          // navigate('/reg_prdt_success');
        // })
        // .catch(error => {
        //   console.error('Error exchanging code for access token:', error);
         
        // });
    // } else {
    //   console.error('Authorization code not found.');
      
    // }
  }, [location]);

  return <div>Processing Facebook login...</div>;
};

export default FacebookCallback;
