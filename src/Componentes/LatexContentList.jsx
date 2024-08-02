import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex';
import { useNavigate } from "react-router-dom";
import '../css/LatexContentList.css';

const LatexContentList = () => {
    const [contents, setContents] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
    const [noResultsMessage, setNoResultsMessage] = useState("");
    const [expandedContentId, setExpandedContentId] = useState(null);
    const [filtroTitulo, setFiltroTitulo] = useState("");
    const [itemsToShow, setItemsToShow] = useState({});
    const [user, setUser] = useState(null);
    const [codigoCreacion, setCodigoCreacion] = useState(""); // Nuevo estado para el código de creación
    const [codigoValido, setCodigoValido] = useState(false); // Nuevo estado para validar el código
    const navigate = useNavigate();
    const itemsPerPage = 7;
    const backendUrl = "https://ricardo-latex-spring.onrender.com";
    const username = "usuarioActual"; // Asegúrate de obtener el nombre de usuario actual de alguna manera

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/latex`, {
                    withCredentials: true
                });
                console.log("Content response:", response.data);
                setContents(response.data);
            } catch (error) {
                console.error("Error fetching content", error);
            }
        };

        fetchContent();
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${backendUrl}/usuarios/${username}`, {
                    withCredentials: true
                });
                setUser(response.data); // Ajusta según la estructura de la respuesta
                console.log(response.data)
            } catch (error) {
                console.error("Error fetching user:", error);
                setUser(null);
            }
        };

        fetchUser();
    }, [username]);

    useEffect(() => {
        const handleBusquedaTituloYCategoria = async () => {
            try {
                if (filtroTitulo.trim() === "" && categoriaSeleccionada === "") {
                    setSearchResults(contents);
                    setNoResultsMessage("");
                } else {
                    const response = await axios.get(
                        `${backendUrl}/api/latex/buscar`,
                        {
                            params: { 
                                title: filtroTitulo,
                                categoria: categoriaSeleccionada
                            },
                        }
                    );

                    if (response.data.length === 0 && filtroTitulo.trim() !== "") {
                        setNoResultsMessage(`No se encontraron resultados para "${filtroTitulo}" en la categoría "${categoriaSeleccionada}". Mostrando todos los resultados`);
                        setSearchResults(contents.filter(content => content.categoria === categoriaSeleccionada));
                    } else {
                        setNoResultsMessage("");
                        setSearchResults(response.data);
                    }
                    console.log("Search results:", response.data);
                }
            } catch (error) {
                console.error("Error al buscar contenidos:", error);
            }
        };

        handleBusquedaTituloYCategoria();
    }, [contents, filtroTitulo, categoriaSeleccionada]);

    useEffect(() => {
        const initialItemsToShow = {};
        contents.forEach(content => {
            if (!initialItemsToShow[content.categoria]) {
                initialItemsToShow[content.categoria] = itemsPerPage;
            }
        });
        setItemsToShow(initialItemsToShow);
    }, [contents]);

    const handleLoadMore = (categoria) => {
        setItemsToShow(prevState => ({
            ...prevState,
            [categoria]: prevState[categoria] + itemsPerPage
        }));
    };

    const handleExpand = (contentId) => {
        setExpandedContentId(prevContentId => prevContentId === contentId ? null : contentId);
    };

    const handleDelete = async (contentId) => {
        try {
            await axios.delete(`${backendUrl}/api/admin/delete/${contentId}`, {
                withCredentials: true
            });
            setContents(prevContents => prevContents.filter(content => content.id !== contentId));
        } catch (error) {
            console.error("Error deleting content:", error);
        }
    };

    const handleUpdate = (contentId) => {
        navigate(`/update-latex/${contentId}`);
    };

    const handleCodigoCreacionChange = (e) => {
        setCodigoCreacion(e.target.value);
    };

    const handleCodigoCreacionSubmit = () => {
        // Validar el código de creación ingresado
        if (codigoCreacion === "CODIGO_VALIDO") { // Cambiar "CODIGO_VALIDO" por el código correcto
            setCodigoValido(true);
        } else {
            setCodigoValido(false);
        }
    };

    return (
        <div className="content-list-container">
            <h1>Latex Content List</h1>
            <div className="search-filters">
                <input
                    type="text"
                    placeholder="Buscar por título"
                    value={filtroTitulo}
                    onChange={(e) => setFiltroTitulo(e.target.value)}
                    className="search-input"
                />
                <div className="dropdown">
                    <button className="dropbtn">Categoría</button>
                    <div className="dropdown-content">
                        <a href="#" onClick={() => setCategoriaSeleccionada("")}>Todas</a>
                        <a href="#" onClick={() => setCategoriaSeleccionada("Cristianismo")}>Cristianismo</a>
                        <a href="#" onClick={() => setCategoriaSeleccionada("Matematica")}>Matematica</a>
                    </div>
                </div>
            </div>
            {noResultsMessage && <p className="no-results-message">{noResultsMessage}</p>}
            {searchResults.length === 0 ? (
                <p>No hay contenidos disponibles.</p>
            ) : (
                searchResults.map((content) => (
                    <div key={content.id} className="content-item">
                        <h2>{content.title}</h2>
                        <Latex>{content.content}</Latex>
                        {content.pdf && (
                            <a href={`data:application/pdf;base64,${content.pdf}`} download={`${content.title}.pdf`}>
                                Descargar PDF
                            </a>
                        )}
                        <button onClick={() => handleExpand(content.id)}>
                            {expandedContentId === content.id ? 'Mostrar Menos' : 'Mostrar Más'}
                        </button>
                        {expandedContentId === content.id && (
                            <div className="expanded-content">
                                <Latex>{content.content}</Latex>
                                {codigoValido && (
                                    <div className="admin-actions">
                                        <button onClick={() => handleUpdate(content.id)}>Editar</button>
                                        <button onClick={() => handleDelete(content.id)}>Eliminar</button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))
            )}
            <div className="codigo-creacion">
                <textarea
                    placeholder="Ingrese el código de creación"
                    value={codigoCreacion}
                    onChange={handleCodigoCreacionChange}
                    className="codigo-input"
                />
                <button onClick={handleCodigoCreacionSubmit} className="codigo-submit">
                    Validar Código
                </button>
            </div>
        </div>
    );
};

export default LatexContentList;