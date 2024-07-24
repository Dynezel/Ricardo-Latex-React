import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DeleteLatexContent = ({ match }) => {
    const [content, setContent] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/latex/${match.params.id}`)
            .then(response => setContent(response.data))
            .catch(error => console.error('Error fetching data:', error));
    }, [match.params.id]);

    const handleDelete = () => {
        axios.delete(`http://localhost:8080/api/latex/${match.params.id}`)
            .then(() => {
                alert('Content deleted successfully!');
                setContent(null);
            })
            .catch(error => console.error('Error deleting content:', error));
    };

    if (!content) return <p>Loading...</p>;

    return (
        <div>
            <h1>Delete LaTeX Content</h1>
            <h2>{content.title}</h2>
            <p>{content.content}</p>
            <button onClick={handleDelete}>Delete</button>
        </div>
    );
};

export default DeleteLatexContent;
