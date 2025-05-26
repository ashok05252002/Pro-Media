// OAuthCallback.jsx
import React from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { extCompanyAuthYoutube } from "../API/api";

class YoutubeCallback extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      message: "Authenticating...",
      once:false
    };
  }

  componentDidMount() {
    const urlParams = new URLSearchParams(window.location.search);
    console.log("debugging", urlParams)
    console.log(urlParams.getAll);
    const code = urlParams.get("code");
    console.log("code", code)
    const product_url = localStorage.getItem("product_url")
    const product_id = localStorage.getItem("product_id")
    const page_name = localStorage.getItem("page_name")
    const inputData = {
        "code": code,
        "data_source_id":8984,
        "product_id": product_id,
        "product_url":product_url,
        "page_name":page_name

      }
    console.log("inputData", inputData)

    if (code) {

      if(!(this.state.once)){
        extCompanyAuthYoutube(inputData)
        .then((res) => {
          console.log("Access Token:", res.data.access_token);
          this.setState({ message: "Authentication successful!" , once:true});

          this.props.navigate("/reg_prdt_success")
          // Optionally store the token in localStorage
        })
        .catch((err) => {
          console.error(err);
          this.setState({ message: "Authentication failed." });
        });
      }
    } else {
      this.setState({ message: "No code in URL." });
    }
  }

  render() {
    return <p>{this.state.message}</p>;
  }
}

export default function YoutubeCallbackWrapper(props) {
  const navigate = useNavigate();
  return <YoutubeCallback {...props} navigate={navigate} />;
}
