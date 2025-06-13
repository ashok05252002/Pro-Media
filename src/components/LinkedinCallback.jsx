// src/Callback.js
import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { extCompanyAuthLinkedin } from "../API/api";

const LinkedInCallback = () => {
  const [message, setMessage] = useState("Authenticating...");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [once, setOnce] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const storedState = sessionStorage.getItem("linkedin_oauth_state");
    const product_url = sessionStorage.getItem("product_url");
    const product_id = sessionStorage.getItem("product_id");
    const page_name = sessionStorage.getItem("page_name");
    console.log(state);
    console.log(storedState); 
    if (!state || state !== storedState) {
      setMessage("Invalid or missing state. Possible CSRF attack.");
      return;
    }

    if (!code) {
      setMessage("Authorization code missing in URL.");
      return;
    }

    if (!page_name || !product_url || !product_id) {
      setMessage("Missing required localStorage data.");
      return;
    }

    const inputData = {
      code,
      data_source_id: 7668,
      product_id,
      product_url,
      page_name,
    };
    console.log('====================================');
    console.log(inputData);
    console.log('====================================');

    if (!once){
      setOnce(true)
      extCompanyAuthLinkedin(inputData)
      .then((res) => {
        console.log("✅ Access Token:", res.data.access_token);
        setMessage("Authentication successful!");
        // navigate("/reg_prdt_success");
        if (window.opener) {
          window.opener.postMessage({ type: 'linkedin_auth', code: code }, window.location.origin);
        }
      })
      .catch((err) => {
        console.error("❌ LinkedIn Auth Error:", err);
        setMessage("Authentication failed."); 
        // navigate("/reg_prdt_success");
      }); 
    }
    
  }, [searchParams, navigate]);

  return <p>{message}</p>;
};

export default LinkedInCallback;
