import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Controlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/stex/stex'; // Modo LaTeX para CodeMirror
import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';
import '../css/CreateLatex.css';

const CreateLatexContent = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [categoria, setCategoria] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [previewContent, setPreviewContent] = useState("");
  const navigate = useNavigate();
  const backendUrl = "https://ricardo-latex-spring.onrender.com";
  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setContent(""); // Limpiar el contenido cuando se selecciona un archivo PDF
  };

  const handleEditorChange = (editor, data, value) => {
    setContent(value);
    // Convertir el contenido LaTeX en HTML utilizando KaTeX para vista previa
    try {
      const parsedContent = value
        .split('\n')
        .map((line, index) => {
          if (line.startsWith('$') && line.endsWith('$')) {
            return <InlineMath key={index}>{line.replace(/\$/g, '')}</InlineMath>;
          } else if (line.startsWith('$$') && line.endsWith('$$')) {
            return <BlockMath key={index}>{line.replace(/\$\$/g, '')}</BlockMath>;
          }
          return <div key={index}>{line}</div>;
        });
      setPreviewContent(parsedContent);
    } catch (error) {
      console.error('Error rendering LaTeX:', error);
      setPreviewContent(<p>Error rendering LaTeX</p>);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content && !file) {
      setError("Debe proporcionar contenido LaTeX o un archivo PDF.");
      return;
    }

    const URL = `${backendUrl}/api/admin/create`;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("categoria", categoria);
    if (file) {
      formData.append("file", file);
    }

    try {
      const response = await axios.post(URL, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("Respuesta del servidor: ", response.data);
      navigate("/");
    } catch (error) {
      console.error("Se ha producido un error al crear el contenido: ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h1 className="form-title">Create New LaTeX Content</h1>
      {error && <p className="error-message">{error}</p>}
      <div className="form-group">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <CodeMirror
          value={content}
          options={{
            mode: 'stex',
            theme: 'default',
            lineNumbers: true
          }}
          onBeforeChange={handleEditorChange}
          disabled={file !== null} // Deshabilita el CodeMirror si hay un archivo PDF seleccionado
        />
      </div>
      <div className="form-group">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="form-input"
        />
      </div>
      <div className="form-group dropdown">
        <button type="button" className="dropbtn">Categoria</button>
        <div className="dropdown-content">
          <a href="#" onClick={() => setCategoria("Cristianismo")}>Cristianismo</a>
          <a href="#" onClick={() => setCategoria("Matematica")}>Matematica</a>
        </div>
      </div>
      <button type="submit" className="form-button">Subir</button>
      <div className="preview-section">
        <h2>Vista Previa</h2>
        <div className="latex-preview">
          {previewContent}
        </div>
      </div>
    </form>
  );
};

export default CreateLatexContent;
