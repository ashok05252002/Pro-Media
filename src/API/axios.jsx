import axios from 'axios';

 // url: "https://e8fb-59-90-29-196.ngrok-free.app/company/login",

const instance = axios.create({
    
    baseURL: import.meta.env.VITE_BASE_API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken")
    console.log("debugging authToken", token)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  });
  
export default instance;