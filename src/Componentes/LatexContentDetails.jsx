import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import Latex from "react-latex";
import "../css/LatexContentDetails.css";

const LatexContentDetail = () => {
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [pdfBlob, setPdfBlob] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const backendUrl = "https://ricardo-latex-spring.onrender.com";

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/latex/${id}`, {
          withCredentials: true,
        });
        setContent(response.data);

        const pdfResponse = await axios.get(
          `${backendUrl}/api/latex/download/${id}`,
          {
            responseType: "blob",
          }
        );
        const url = window.URL.createObjectURL(pdfResponse.data);
        setPdfBlob(pdfResponse.data);
        setPdfUrl(url);
      } catch (error) {
        console.error("Error fetching content", error);
      }
    };

    fetchContent();

    return () => {
      if (pdfUrl) {
        window.URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [id, pdfUrl]);

  if (!content) {
    return <p>Loading...</p>;
  }

  const handleDownload = () => {
    const url = window.URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${content.title}.pdf`);
    document.body.appendChild(link);
    link.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="latex-content-detail">
      <h1>{content.title}</h1>
      {pdfUrl ? (
        <div className="pdf-viewer">
          <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
            <Viewer
              fileUrl={pdfUrl}
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