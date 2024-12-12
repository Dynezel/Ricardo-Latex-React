import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LatexContentList from './Componentes/LatexContentList';
import CreateLatexContent from './Componentes/CreateLatexContent';
import UpdateLatexContent from './Componentes/UpdateLatexContent';
import DeleteLatexContent from './Componentes/DeleteLatexContent'
import Login from './Componentes/Login';
import RegistrarUsuario from './Componentes/RegistrarUsuario';
import LatexContentDetail from './Componentes/LatexContentDetails';
import Navbar from './Componentes/Navbar';

function App() {
  return (
    <>
        <BrowserRouter>
        <Navbar/>
        <Routes>
            <Route path="/" element={ <LatexContentList/> } />
            <Route path="/latex/:id" element={ <LatexContentDetail/> } />
            <Route path="/create/3d9b4c8e-2764-4d1f-84df-12fa9a123d49-93b1f0d9c7a8a9cba5e9d8c3a7b2f4e6" element={ <CreateLatexContent/> } />
            <Route path="/update/:id" element={ <UpdateLatexContent/> } />
            <Route path="/delete/:id" element={ <DeleteLatexContent/> } />
            <Route path="/usuario/registro" element= { <RegistrarUsuario/> } />
            <Route path="/login" element= { <Login/> } />
        </Routes>
        </BrowserRouter>
    </>
);
};

export default App
