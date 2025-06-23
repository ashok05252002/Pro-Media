// src/Callback.js
import React, { useEffect, useState } from "react";
import { extCompanyAuthTwitter } from "../API/api";
import { useNavigate } from 'react-router-dom';

export default function TWTCallback() {
  const [message, setMessage] = useState("Authenticating...");
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const state = urlParams.get("state");

    const product_url = sessionStorage.getItem("product_url");
    const product_id = sessionStorage.getItem("product_id");
    const page_name = sessionStorage.getItem("page_name");
    const code_verifier = sessionStorage.getItem(`twitter_verifier_${state}`);
    const tw_state = sessionStorage.getItem("tw_state");

    if (!state) {
      console.log("State parameter missing");
      setMessage("State parameter missing.");
      return;
    }

    if (!product_url || !page_name) {
      console.log("Missing required localStorage data.");
      setMessage("Missing required data.");
      // navigate("/dashboard");
      return;
    }

    if (state !== tw_state) {
      console.log("State mismatch. Unauthorized request.");
      setMessage("Unauthorized access. State mismatch.");
      // navigate("/regProduct");
      return;
    }

    if (!code || !code_verifier) {
      setMessage("Missing code or verifier.");
      return;
    }

    const inputData = {
      code: code,
      data_source_id: 8487,
      product_id: product_id,
      product_url: product_url,
      page_name: page_name,
      code_verifier: code_verifier
    };

    extCompanyAuthTwitter(inputData )
      .then((res) => {
        console.log("Access Token:", res.data.access_token);
        setMessage("Authentication successful!");
        // navigate("/reg_prdt_success");
        // if (window.opener) {
        //   window.opener.postMessage({ type: 'twitter_auth', code: code }, window.location.origin);
        // }
      })
      .catch((err) => {
        console.error(err);
        setMessage("Authentication failed.");
        // navigate("/regProduct");
      });

  }, [navigate]);

  return <p>{message}</p>;
}
