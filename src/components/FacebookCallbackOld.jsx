import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { extCompanyAuthFacebook } from '../API/api';

// Create a wrapper component to provide hooks to class component
function withRouter(Component) {
  return function WrappedComponent(props) {
    const location = useLocation();
    const navigate = useNavigate();
    return <Component {...props} location={location} navigate={navigate} />;
  }
}

class FacebookCallback extends React.Component {
  
  componentDidMount() {
    console.log("debugging componentDidMount")
    this.processAuth();
  }

  processAuth = async () => {
    const { location, navigate } = this.props;
    const params = new URLSearchParams(location.search);
    const code = params.get('code');
    // const state = params.get('state');

    if (!code) {
      navigate('/regproduct?error=no_code');
      return;
    }

    try {
      // const stateData = state ? JSON.parse(decodeURIComponent(state)) : {};
      const product_id = localStorage.getItem("product_id");
      const product_url = localStorage.getItem("product_url");
      const page_name = localStorage.getItem("page_name")
      console.log(page_name)
      if (!page_name)
      {
        console.log("There is no page name")
        navigate('/dashboard');
      }
      if(!code)
      {
        console.log("there is no code")
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
        "data_source_id":7066,
        "product_id":product_id,
        "product_url":product_url,
        "page_name":page_name

      }
      // const response = await axios.post('/api/auth/facebook', {
      //   code,
      //   product_id,
      //   product_url
      // });
      extCompanyAuthFacebook(inputData)
      .then((response) => {
        if(response){

            this.props.navigate('/dashboard');
        }
      }).catch((error) => {
        if (error.response) {
          console.log(error.response)
          console.log(error.response.status)
          console.log(error.response.headers)
          }
      })
    } catch (error) {
      console.error("Auth error:", error);
      navigate('/regproduct');
    }
  };

  render() {
    return (
      <div style={{ padding: '20px' }}>
        <h2>Processing Facebook Authentication</h2>
        <p>Please wait while we connect your account...</p>
      </div>
    );
  }
}

export default withRouter(FacebookCallback);