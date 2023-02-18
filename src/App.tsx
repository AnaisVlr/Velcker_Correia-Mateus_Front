import React from 'react';
import './styles/App.css';
import {Routes, Route} from 'react-router-dom';

import Home from './components/HomeComponent';
import JeuComponent from './components/JeuComponent';
import BenevoleList from './components/benevole/BenevoleList';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/jeux" element={ <JeuComponent/> }/>
      <Route path="/jeux/:id" element={ <JeuComponent/> }/>
      <Route path="/benevoles" element={ <BenevoleList/> }/>
    </Routes>
  );
}

export default App;
