import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateLatexContent = () => {
    const { id } = useParams(); // Obtener el id de la URL
    const [content, setContent] = useState(null);
    const [title, setTitle] = useState('');
    const [contentText, setContentText] = useState('');
    const [categoria, setCategoria] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/latex/${id}`, { withCredentials: true });
                const latexContent = response.data;
                setContent(latexContent);
                setTitle(latexContent.title);
                setContentText(latexContent.content);
                setCategoria(latexContent.categoria);
            } catch (error) {
                console.error('Error fetching content:', error);
            }
        };

        fetchContent();
    }, [id]);

    const handleUpdate = async () => {
        try {
            await axios.put(`http://localhost:8080/api/admin/${id}`, {
                title,
                content: contentText,
                categoria,
            }, { withCredentials: true });
            navigate('/');
        } catch (error) {
            console.error('Error updating content:', error);
        }
    };

    if (!content) return <p>Loading...</p>;

    return (
        <div>
            <h1>Update Content</h1>
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
            />
            <textarea
                value={contentText}
                onChange={(e) => setContentText(e.target.value)}
                placeholder="Content"
            />
            <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
            >
                <option value="Cristianismo">Cristianismo</option>
                <option value="Matematica">Matematica</option>
            </select>
            <button onClick={handleUpdate}>Update</button>
        </div>
    );
};

export default UpdateLatexContent;