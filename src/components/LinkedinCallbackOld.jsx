import React, { Component } from 'react';
import axios from 'axios';

import { extCompanyAuthLinkedin } from '../API/api';
import { useNavigate } from 'react-router-dom';

// Create a wrapper to provide navigate to class component
function withRouter(Component) {
  return function WrappedComponent(props) {
    const navigate = useNavigate();
    return <Component {...props} navigate={navigate} />;
  };
}

class LinkedInCallback extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: null,
      once:false
      
    };
  }

  componentDidMount() {
    if(!(this.state.once)){
      this.handleLinkedInCallback();
    }
  }

  handleLinkedInCallback = async () => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    // const error = params.get('error');
    const product_id = localStorage.getItem("product_id")
    const product_url = localStorage.getItem("product_url")
    const page_name = localStorage.getItem("page_name")

    // Check for OAuth errors first
    // if (error) {
    //   this.setState({
    //     loading: false,
    //     error: `LinkedIn authentication failed: ${error}`,
    //     once:false
    //   });
    //   return;
    // }
    if(!state)
    {
      console.log("state variable missing")
    
    }
    if (!page_name)
      {
          console.log("There is no page name")

          
      }
    if(!product_url)
      {
          console.log("there is no product url")
          
      }
    // Verify state matches what we stored
    const storedState = sessionStorage.getItem('linkedin_oauth_state');
    if (state !== storedState) {
      this.setState({
        loading: false,
        error: 'State mismatch. Possible CSRF attack.'
      });
      return;
    }

    try {
      // Exchange authorization code for access token
    
        
      // Fetch user profile and email in parallel
      const inputData = {
              "code": code,
              "data_source_id":7668,
              "product_id": product_id,
              "product_url":product_url,
              "page_name":page_name,      
            }
          console.log("inputData", inputData)
      
          if (code) {
              
              extCompanyAuthLinkedin(inputData)
              .then((res) => {
                console.log("Access Token:", res.data);
                this.setState({ 
                    loading:false,
                    error: "Authentication successful!",
                    once:true
                   });
                this.props.navigate("/reg_prdt_success")   
                // Optionally store the token in localStorage
              })
              .catch((err) => {
                console.error(err);
                this.setState({
                    loading: false, 
                    error: "Authentication failed." ,
                    once:true
                    });
              });
          } else {
            this.setState({ 
                loading:false,
                error: "No code in URL." });
          }

      // Store user data (consider using Redux or Context in production)
      
      // Clear the OAuth state
      localStorage.removeItem('linkedin_oauth_state');
      
      // Redirect to dashboard or home
      this.props.history.push('/dashboard');

    } catch (error) {
      let errorMessage = 'Failed to authenticate with LinkedIn';
      if (error.response) {
        errorMessage += `: ${error.response.data.error_description || error.response.statusText}`;
      } else {
        errorMessage += `: ${error.message}`;
      }

      this.setState({
        loading: false,
        error: errorMessage,
        
      });
    }
  };

  render() {
    const { loading, error, once } = this.state;

    if (loading) {
      return (
        <div className="linkedin-callback">
          <div className="loading-spinner"></div>
          <p>Authenticating with LinkedIn...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="linkedin-callback error">
          <h3>Authentication Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (userData) {
      // Normally we redirect after success, but just in case:
      return (
        <div className="linkedin-callback success">
          <p>Authentication successful! Redirecting...</p>
        </div>
      );
    }

    return null;
  }
}

export default withRouter(LinkedInCallback);