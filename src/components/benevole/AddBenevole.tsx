import '../../styles/BenevoleList.css'

import React from 'react'
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { decodeToken } from 'react-jwt';

import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';


export default function AddBenevole() {
  const [error, setError] = useState<AxiosError | null>(null);
  const [success, setSuccess] = useState<String | null>(null);

  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("123");

  const handleSubmit = (event: any) => {
    event.preventDefault();
    
    if(nom.length === 0 || prenom.length === 0 || email.length === 0 || password.length === 0) {
      setError(new AxiosError("Tous les champs doivent être remplis !"))
    }
    else {
      const data = {
        "nom_benevole": nom,
        "prenom_benevole": prenom,
        "email_benevole": email,
        "password_benevole": password
      }
  
      axios.post("http://localhost:3333/benevole", data)
      .then(res => {
        setSuccess("Création réussie")
      }).catch((error) => {
        if(error.response){
          if(error.response.data)
            error.message = "Erreur lors de la tentative de création : "+error.response.data.message
        } else error.message = "Erreur lors de la tentative de création : "+error
        setError(error)
      })
    }
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

    
  }, [navigate])

  return (
    <>
      <Button
      color="secondary"
      onClick={handleDisconnect}>
        Déconnexion
      </Button>
      <Link to="/benevoles">Voir la liste des bénévoles</Link>
      <Link to="/benevoles/addCreneau">Affecter des bénévoles à des zones</Link>

      {error &&
        <Alert onClose={() => {setError(null)}} severity="error">
          {error.message}
        </Alert>
      }
      {success &&
        <Alert onClose={() => {setSuccess(null)}} severity="success">
          {success}
        </Alert>
      }

      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
      >
        <Stack direction="column">
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
        </Stack>
      </Box>
    </>
  )
}
