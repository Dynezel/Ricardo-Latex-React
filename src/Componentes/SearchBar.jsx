import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchBar = ({ setSearchResults }) => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const backendUrl = "https://ricardo-latex-spring-production.up.railway.app";

    useEffect(() => {
        const handleSearch = async () => {
            try {
                if (query.trim() === "") {
                    // Si el campo de búsqueda está vacío, no realizar la búsqueda
                    setResults([]);
                } else {
                    // Si hay un término de búsqueda, buscar por el término
                    const response = await axios.get(`${backendUrl}/api/latex/buscar`,
                    {
                      params: { title: query },
                    }
                  );
                    setResults(response.data);
                }
            } catch (error) {
                console.error("Error al buscar contenido: ", error);
            }
        };

        handleSearch();
    }, [query]);

    const handleChange = (e) => {
        setQuery(e.target.value);
    };

    useEffect(() => {
        setSearchResults(results);
    }, [results, setSearchResults]);

    return (
        <form onSubmit={(e) => e.preventDefault()}>
            <input
                type="text"
                placeholder="Buscar por título o categoría"
                value={query}
                onChange={handleChange}
                required
            />
        </form>
    );
};

export default SearchBar;