import React from 'react';
import './styles/App.css';
import {Routes, Route} from 'react-router-dom';

import HomePage from './components/HomePage';
import AddBenevole from './components/benevole/AddBenevole';
import AddCreneau from './components/benevole/AddCreneau';
import NavigationBar from './components/NavigationBar';

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage/>}/>
      <Route path="/jeux" element={<NavigationBar page="jeu"/>}/>
      <Route path="/benevoles" element={ <NavigationBar page="benevole"/>}/>
      <Route path="/benevoles/addBenevole" element={ <AddBenevole/> }/>
      <Route path="/benevoles/addCreneau" element={ <AddCreneau/> }/>
      <Route path="/zones" element={<NavigationBar page="zone"/>}/>
    </Routes>
  );
}

export default App;
