import React from 'react';
import './styles/App.css';
import {Routes, Route} from 'react-router-dom';

import Home from './components/HomeComponent';
import JeuComponent from './components/JeuComponent';
import BenevoleList from './components/benevole/BenevoleList';
import AddBenevole from './components/benevole/AddBenevole';
import AddCreneau from './components/benevole/AddCreneau';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}/>
      <Route path="/jeux" element={ <JeuComponent/> }/>
      <Route path="/jeux/:id" element={ <JeuComponent/> }/>
      <Route path="/benevoles" element={ <BenevoleList/> }/>
      <Route path="/benevoles/addBenevole" element={ <AddBenevole/> }/>
      <Route path="/benevoles/addCreneau" element={ <AddCreneau/> }/>
    </Routes>
  );
}

export default App;
