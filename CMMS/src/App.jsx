import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BarraNavegacion from './components/NavBar';
import Inicio from './components/Inicio/Inicio';
import Medicos from './components/Medicos/Medicos';
import Casos from './components/Casos/Casos';
import { TablaEventos } from './components/Eventos/Eventos';


function App() {

  return (
    <>
      <header>
        <BarraNavegacion />
      </header>
      <Routes>
        <Route path="/" element={<Inicio/>} />
        <Route path="/equiposMedicos" element={<Medicos />} />
        <Route path="/:equipoId" element={<Casos />} />
        <Route path="/:equipoId/:caseId" element={<TablaEventos />} />
      </Routes>
    </>
  );
}

export default App;
