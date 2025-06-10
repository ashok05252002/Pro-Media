import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { extCompanyAuthYoutube } from "../API/api";

export default function YoutubeCallback() {
  const [message, setMessage] = useState("Authenticating...");
  const [once, setOnce] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const product_url = sessionStorage.getItem("product_url");
    const product_id = sessionStorage.getItem("product_id");
    const page_name = sessionStorage.getItem("page_name");

    const inputData = {
      code: code,
      data_source_id: 8984,
      product_id: product_id,
      product_url: product_url,
      page_name: page_name
    };

    console.log("inputData", inputData);

    if (code && !once) {
      setOnce(true); // Prevent multiple submissions
      extCompanyAuthYoutube(inputData)
        .then((res) => {
          console.log("Access Token:", res.data.access_token);
          setMessage("Authentication successful!");
          if (window.opener) {
            window.opener.postMessage({ type: 'youtube_auth', code: code }, window.location.origin);
          }
        })
        .catch((err) => {
          console.error(err);
          setMessage("Authentication failed.");
        });
    } else if (!code) {
      setMessage("No code in URL.");
    }
  }, [once, navigate]);

  return <p>{message}</p>;
}
