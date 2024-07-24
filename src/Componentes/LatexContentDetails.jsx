import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Worker, Viewer, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Latex from "react-latex";
import "../css/LatexContentDetails.css";

const LatexContentDetail = () => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/latex/${id}`,
          {
            withCredentials: true,
          }
        );
        setContent(response.data);
      } catch (error) {
        console.error("Error fetching content", error);
      }
    };

    fetchContent();
  }, [id]);

  if (!content) {
    return <p>Loading...</p>;
  }

  const handleDownload = async () => {
    try {
      const fileName = content.pdfPath.split("\\").pop();
      const response = await axios.get(
        `http://localhost:8080/api/latex/download/${encodeURIComponent(
          fileName
        )}`,
        {
          responseType: "blob",
        }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Error downloading file", error);
    }
  };

  return (
    <div className="latex-content-detail">
      <h1>{content.title}</h1>
      {content.pdfPath ? (
        <div className="pdf-viewer">
          <Worker
            workerUrl={`https://unpkg.com/pdfjs-dist@2.7.570/build/pdf.worker.min.js`}
          >
            <Viewer
              fileUrl={`http://localhost:8080/api/latex/download/${encodeURIComponent(content.pdfPath.split("\\").pop())}`}
              plugins={[defaultLayoutPluginInstance]}
              defaultScale={1} // Establece el zoom al 100%
            />
          </Worker>
          <button onClick={handleDownload}>Download PDF</button>
        </div>
      ) : (
        <div id="pdf-content" className="content-details">
          {typeof content.content === "string" ? (
            <Latex>{content.content}</Latex>
          ) : (
            <p>Error: content no es una cadena de texto.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default LatexContentDetail;
