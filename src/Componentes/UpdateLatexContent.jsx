import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import "../css/CreateLatex.css";

const UpdateLatexContent = () => {
  const { id } = useParams(); // Obtener el id de la URL
  const [content, setContent] = useState(null);
  const [title, setTitle] = useState("");
  const [contentText, setContentText] = useState("");
  const [categoria, setCategoria] = useState("");
  const navigate = useNavigate();
  const backendUrl = "https://ricardo-latex-spring.onrender.com";

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/latex/${id}`, {
          withCredentials: true,
        });
        const latexContent = response.data;
        setContent(latexContent);
        setTitle(latexContent.title);
        setContentText(latexContent.content);
        setCategoria(latexContent.categoria);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    fetchContent();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${backendUrl}/api/admin/${id}`,
        {
          title,
          content: contentText,
          categoria,
        },
        { withCredentials: true }
      );
      navigate("/");
    } catch (error) {
      console.error("Error updating content:", error);
    }
  };

  if (!content) return <p>Loading...</p>;

  return (
    <div className="form-container">
      <h1 className="form-title">Actualizar Articulo</h1>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Titulo"
        className="form-input"
      />
      <textarea
        value={contentText}
        onChange={(e) => setContentText(e.target.value)}
        placeholder="Contenido"
        className="form-input"
      />
      <div className="form-group dropdown">
        <button type="button" className="dropbtn">
          Categoria
        </button>
        <div className="dropdown-content">
          <a href="#" onClick={() => setCategoria("Cristianismo")}>
            Cristianismo
          </a>
          <a href="#" onClick={() => setCategoria("Matematica")}>
            Matematica
          </a>
        </div>
      </div>
      <button type="submit" className="form-button" onClick={handleUpdate}>Update</button>
    </div>
  );
};

export default UpdateLatexContent;
