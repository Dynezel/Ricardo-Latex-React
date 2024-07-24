import React, { useState } from "react";
import axios from "axios";

export default function RegistrarUsuario() {
  const [email, setEmail] = useState("");
  const [contrasenia, setContrasenia] = useState("");
  const [contrasenia2, setContrasenia2] = useState("");
  const [error, setError] = useState("");
  const backendUrl = process.env.REACT_APP_BACKEND_URL;

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      // Validar campos obligatorios y contraseñas coincidentes
      if ( !email || !contrasenia) {
        setError("Por favor, completa todos los campos.");
        return;
      }

      if (contrasenia !== contrasenia2) {
        setError("Las contraseñas no coinciden.");
        return;
      }

      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", contrasenia);
      formData.append("contrasenia2", contrasenia2);

      // Enviar solicitud POST al backend para registrar el usuario
    try {
      const response = await axios.post(
        `${backendUrl}/usuarios/register`,
        formData, // Usamos formData en lugar de un objeto plano
      );
      console.log("Se ha registrado con exito al usuario", response.data);
      if (response.status === 200) {
        // Redirigir a la página principal
        window.location.href = '/login';
      }
    }
     catch (error) {
      console.error("Error al registrar usuario:", error);
      setError("Error al registrar usuario. Por favor, intenta nuevamente.");
    }
  } catch (error) {
    console.error("Error al registrar usuario numero 2:", error);
    setError("Error al registrar usuario. Por favor, intenta nuevamente.");
  };
}


  return (
    <form className="formularioRegistro" onSubmit={handleSignUp}>
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-group">
        <label htmlFor="email">Correo Electrónico:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="contrasenia">Contraseña:</label>
        <input
          type="password"
          id="contrasenia"
          value={contrasenia}
          onChange={(e) => setContrasenia(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="contrasenia2">Confirmar Contraseña:</label>
        <input
          type="password"
          id="contrasenia2"
          value={contrasenia2}
          onChange={(e) => setContrasenia2(e.target.value)}
          required
        />
      </div>
      <button type="submit">Registrarse</button>
    </form>
  );
}