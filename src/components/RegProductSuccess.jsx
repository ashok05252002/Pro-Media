import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function RegProductSuccess() {
    const navigate = useNavigate();
    const handleGoDashboard = (e) =>{
        e.preventDefault();
        navigate("/dashboard")
    }   
    return <div>Your product registered into PRO MEDIA app Successfully
        <div style={{margin:"40px",alignItems:"center"}}>
        <button onClick={handleGoDashboard} style={{backgroundColor:"skyblue", alignItems:"center"}}>Go to Dashboard</button>
        </div>
  </div>;
}

export default RegProductSuccess;
