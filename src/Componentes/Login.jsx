import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const backendUrl = "https://ricardo-latex-spring.onrender.com";

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${backendUrl}/auth/login`, {
                username,
                password
            }, {
                withCredentials: true
            });
            console.log(response.data);
            if (response.status === 200) {
              window.location.href = '/';
            }
        } catch (error) {
            console.error('Error logging in', error);
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
