import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const backendUrl = "https://ricardo-latex-spring.onrender.com";

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');
    try {
        const response = await axios.post(`${backendUrl}/auth/login`, 
            new URLSearchParams({
                username: username,
                password: password
            }), 
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                withCredentials: true
            }
        );
        console.log(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/');
    } catch (error) {
        if (error.response) {
            console.error('Error response', error.response);
            setError('Login failed: ' + error.response.data);
        } else if (error.request) {
            console.error('Error request', error.request);
            setError('Login failed: No response from server');
        } else {
            console.error('Error', error.message);
            setError('Login failed: ' + error.message);
        }
    }
};

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
