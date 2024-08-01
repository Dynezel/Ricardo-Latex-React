import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://ricardo-latex-spring.onrender.com/auth/login', {
                username,
                password
            }, {
                withCredentials: true
            });
            console.log(response.data);
            // Manejar la respuesta, almacenar el token, redirigir, etc.
            if (response.status === 200) {
              // Redirigir a la página principal
              window.location.href = '/';
            }
        } catch (error) {
            console.error('Error logging in', error);
            // Manejar el error
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <div>
                <label>Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div>
                <label>Password</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <button type="submit">Login</button>
        </form>
    );
};

export default Login;