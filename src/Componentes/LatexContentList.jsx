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
    const [creationCode, setCreationCode] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
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
                console.log(response.data);
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

    const toggleExpanded = (id) => {
        navigate(`/latex/${id}`);
    };

    const loadMore = (category) => {
        setItemsToShow(prevItemsToShow => ({
            ...prevItemsToShow,
            [category]: prevItemsToShow[category] + itemsPerPage
        }));
    };

    const handleEdit = (id) => {
        navigate(`/update/${id}`);
    };

    const handleDelete = (id) => {
        axios.delete(`${backendUrl}/api/admin/${id}`, { withCredentials: true })
            .then(response => {
                alert('Content deleted successfully');
                setContents(prevContents => prevContents.filter(content => content.id !== id));
            })
            .catch(error => {
                console.error('Error deleting content:', error);
                alert('Failed to delete content');
            });
    };

    const handleLogout = async () => {
        try {
            await axios.post(`${backendUrl}/auth/logout`, {}, { withCredentials: true });
            localStorage.removeItem('user');
            setUser(null);
            navigate("/login");
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const checkCreationCode = async () => {
        try {
            if (creationCode.toLowerCase() === 'si') {
                // Scroll to top of the page
                window.scrollTo(0, 0);
            } else {
                const response = await axios.post(`${backendUrl}/api/admin/verify-code`, 
                {
                    code: creationCode
                }, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.data) {
                    setIsAdmin(true);
                    console.log(response.data);
                } else {
                    // No alert for incorrect code
                    console.log("Invalid creation code.");
                }
            }
        } catch (error) {
            console.error("Error verifying code:", error);
            // Handle the error silently
        }
    };

    const displayContents = searchResults.length > 0 ? searchResults : contents;

    const categorizedContents = displayContents.reduce((acc, content) => {
        const { categoria } = content;
        if (!acc[categoria]) {
            acc[categoria] = [];
        }
        acc[categoria].push(content);
        return acc;
    }, {});

    return (
        <div className="latex-content-list">
            <h1>List of LaTeX Contents</h1>
            {user && (
                <div>
                    <p>{user.username}, {user.rol}</p>
                </div>
            )}
            {user && <button onClick={handleLogout}>Logout</button>}
            <input
                type="text"
                placeholder="Buscar por título"
                value={filtroTitulo}
                onChange={(e) => setFiltroTitulo(e.target.value)}
                className="busqueda-input"
            />
            <select
                value={categoriaSeleccionada}
                onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                className="categoria-select"
            >
                <option value="">Todas las categorías</option>
                <option value="Cristianismo">Cristianismo</option>
                <option value="Matematica">Matematica</option>
            </select>
            {noResultsMessage && <p className="no-results-message">{noResultsMessage}</p>}
            {Object.keys(categorizedContents).map((category, index) => (
                <React.Fragment key={category}>
                    <div className="category-section">
                        <h2 className="category-title"><u>{category}</u></h2>
                        {categorizedContents[category].slice(0, itemsToShow[category]).map(content => (
                            <div key={content.id} className="content-item">
                                <h3 
                                    className="content-title" 
                                    onClick={() => toggleExpanded(content.id)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {content.title}
                                </h3>
                                {expandedContentId === content.id && (
                                    <div className="content-details">
                                        {typeof content.content === 'string' ? (
                                            <Latex>{content.content}</Latex>
                                        ) : (
                                            <p>Error: content no es una cadena de texto.</p>
                                        )}
                                    </div>
                                )}
                                {isAdmin && (
                                    <div className="admin-buttons">
                                        <button onClick={() => handleEdit(content.id)} className="edit-button">
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(content.id)} className="delete-button">
                                            Eliminar
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    {categorizedContents[category].length > itemsToShow[category] && (
                        <div className="load-more-container">
                            <button onClick={() => loadMore(category)} className="load-more-button">
                                Cargar más
                            </button>
                        </div>
                    )}
                    {index < Object.keys(categorizedContents).length - 1 && <hr className="category-separator" />}
                </React.Fragment>
            ))}
            <div className="creation-code-section">
                <input
                    type="text"
                    placeholder='Volver arriba? "Si"'
                    value={creationCode}
                    onChange={(e) => setCreationCode(e.target.value)}
                    className="creation-code-input"
                />
                <button onClick={checkCreationCode} className="check-code-button">
                    Volver Arriba
                </button>
            </div>
        </div>
    );
};

export default LatexContentList;