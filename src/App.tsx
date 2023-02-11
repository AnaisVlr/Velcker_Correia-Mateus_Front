import React from 'react';
import './styles/App.css';
import {Routes, Route} from 'react-router-dom';

import Home from './components/HomeComponent';
import JeuComponent from './components/JeuComponent';
import BenevoleComponent from './components/BenevoleComponent';
import HeaderComponent from './components/HeaderComponent';

function App() {
  return (
    <>
      <HeaderComponent></HeaderComponent>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/jeux" element={ <JeuComponent/> }/>
        <Route path="/jeux/:id" element={ <JeuComponent/> }/>
        <Route path="/benevoles" element={ <BenevoleComponent/> }/>
      </Routes>
    </>
  );
}

export default App;
