import React from 'react'
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from 'react-jwt';

import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import Benevole from "../../models/Benevole";

export default function AddBenevole() {
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("123");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    
    const data = {
      "nom_benevole": nom,
      "prenom_benevole": prenom,
      "email_benevole": email,
      "password_benevole": password
    }

    axios.post("http://localhost:3333/benevole/create", data)
    .then(res => {
      console.log(res);
    }).catch((error) => {
      console.log(error);
    })
  }

  const navigate = useNavigate();

  const handleDisconnect = () => {
    localStorage.removeItem("access_token")
    navigate('/');
  }

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if(token != null) { // S'il existe
      if(decodeToken(token) == null) //Si token invalide
        navigate('/');
    }
    else navigate('/');

    
  }, [])

  return (
    <>
      <Button
        color="secondary"
        onClick={handleDisconnect}>
        Déconnexion
      </Button>
      <Link to="/benevoles">Voir la liste des bénévoles</Link>
      <Link to="/benevoles/addCreneau">Affecter des bénévoles à des zones</Link>
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <TextField
          id="nom-textfield"
          required
          label="Nom"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setNom(event.target.value);}}
        />
        <TextField
          id="prenom-textfield"
          required
          label="Prénom"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setPrenom(event.target.value);}}
        />
        <TextField
          id="email-textfield"
          required
          label="Email"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setEmail(event.target.value);}}
        />
        <TextField
          id="password-textfield"
          required
          label="Mot de passe"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setPassword(event.target.value);}}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
        >
          Créer le compte
        </Button>
      </Box>
    </>
  )
}
