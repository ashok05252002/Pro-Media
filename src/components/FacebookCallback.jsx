// src/Callback.js
import React, { useEffect, useState } from "react";
import { extCompanyAuthFacebook } from "../API/api";
import { useNavigate } from 'react-router-dom';

const FacebookCallback = () => {
  const [message, setMessage] = useState("Authenticating...");
  const [once, setOnce] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    const product_url = sessionStorage.getItem("product_url");
    const product_id = sessionStorage.getItem("product_id");
    const page_name = sessionStorage.getItem("page_name");

    if (!page_name) console.warn("Missing page name");
    if (!product_url) console.warn("Missing product URL");

    const inputData = {
      code,
      data_source_id: 8487,
      product_id,
      product_url,
      page_name,
    };

    console.log("inputData", inputData);

    if (code && !once) {
      setOnce(true);
      extCompanyAuthFacebook(inputData)
        .then((res) => {
          console.log("Access Token:", res.data.access_token);
          setMessage("Authentication successful!");
          if (window.opener) {
            window.opener.postMessage({ type: 'facebook_auth', code: code }, window.location.origin);
          }
        })
        .catch((err) => {
          console.error("Authentication failed", err);
          setMessage("Error during authentication.");
        });
    } else if (!code) {
      setMessage("No code in URL.");
    }
  }, [once, navigate]);

  return <p>{message}</p>;
};

export default FacebookCallback;
