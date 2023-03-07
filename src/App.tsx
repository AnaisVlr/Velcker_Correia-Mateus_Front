import React from 'react';
import './styles/App.css';
import {Routes, Route} from 'react-router-dom';

import HomePage from './components/HomePage';
import NavigationBar from './components/NavigationBar';

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: [
      'Playfair Display',
      'serif'
    ].join(','),
  },
  palette: {
    primary: {
      main: "#4F528C", //violet
    },
    secondary: {
      main: '#F2B6CC', //Rose
    },
    error:{
      main: '#F24C27', //Rouge
    },
    info:{
      main: '#F2B6CC', //rose
    },
    warning:{
      main: '#F29F05', //orange
    }
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<HomePage/>}/>
        <Route path="/jeux" element={<NavigationBar page="jeux"/>}/>
        <Route path="/jeux/add" element={<NavigationBar page="addJeu"/>}/>
        <Route path="/benevoles" element={ <NavigationBar page="benevole"/>}/>
        <Route path="/benevoles/addBenevole" element={ <NavigationBar page="addBenevole"/> }/>
        <Route path="/benevoles/addCreneau" element={ <NavigationBar page="addCreneau"/> }/>
        <Route path="/zones" element={<NavigationBar page="zone"/>}/>
        <Route path="/profil/:user" element={ <NavigationBar page="profil"/> }/>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
