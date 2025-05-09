import React, { useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';

const PdfGenerator = ({ documentoId }) => {
    const [documento, setDocumento] = useState(null);
    const backendUrl = "https://ricardo-latex-spring-production.up.railway.app";

    useEffect(() => {
        // Obtener los datos del documento desde el backend
        fetch(`${backendUrl}/api/latex/${documentoId}`)
            .then(response => response.json())
            .then(data => setDocumento(data))
            .catch(error => console.error('Error al obtener el documento:', error));
    }, [documentoId]);

    const generarPdf = () => {
        const doc = new jsPDF();

        doc.text(documento.title, 10, 10);
        doc.text(documento.content, 10, 20);

        doc.save(`${documento.title}.pdf`);
    };

    return (
        <div>
            {documento ? (
                <div>
                    <h1>{documento.title}</h1>
                    <p>{documento.content}</p>
                    <button onClick={generarPdf}>Generar PDF</button>
                </div>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
};

export default PdfGenerator;
