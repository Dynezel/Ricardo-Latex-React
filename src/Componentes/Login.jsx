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
        const response = await axios.post(`https://ricardo-latex-spring.onrender.com/perform_login`, {
            username,
            password
        }, {
            withCredentials: true
        });
        console.log(response.data);
        // Guardar el usuario en el localStorage
        localStorage.setItem('user', JSON.stringify(response.data));
        // Redirigir a la página principal
        navigate('/');
    } catch (error) {
        if (error.response) {
            // El servidor respondió con un estado diferente a 2xx
            console.error('Error response', error.response);
            setError('Login failed: ' + error.response.data);
        } else if (error.request) {
            // La solicitud fue hecha pero no se recibió respuesta
            console.error('Error request', error.request);
            setError('Login failed: No response from server');
        } else {
            // Algo pasó al configurar la solicitud
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
