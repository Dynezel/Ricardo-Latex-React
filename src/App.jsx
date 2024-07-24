import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LatexContentList from './Componentes/LatexContentList';
import CreateLatexContent from './Componentes/CreateLatexContent';
import UpdateLatexContent from './Componentes/UpdateLatexContent';
import DeleteLatexContent from './Componentes/DeleteLatexContent'
import Login from './Componentes/Login';
import RegistrarUsuario from './Componentes/RegistrarUsuario';
import LatexContentDetail from './Componentes/LatexContentDetails';

function App() {
  return (
    <>
        <BrowserRouter>
        <Routes>
            <Route path="/" element={ <LatexContentList/> } />
            <Route path="/latex/:id" element={ <LatexContentDetail/> } />
            <Route path="/create" element={ <CreateLatexContent/> } />
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
