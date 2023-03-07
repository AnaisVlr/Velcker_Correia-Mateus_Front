import '../../styles/BenevoleList.css'
import '../../styles/App.css';

import React from 'react'
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link } from 'react-router-dom';

import {TextField, Box, Button, Alert, Container, Stack} from '@mui/material';

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

  return (
    <>
      <Stack direction="row" spacing={2}>

        <Link to="/benevoles"><Button sx={{textTransform: 'none'}} variant="outlined">Retour</Button></Link>
        <Link to="/benevoles/addCreneau"><Button sx={{textTransform: 'none'}} variant="outlined">Affecter des bénévoles à des zones</Button></Link>
      </Stack>

      <Container component="main" maxWidth="xs">
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
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="nom-textfield"
            label="Nom"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setNom(event.target.value);}}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="prenom-textfield"
            label="Prénom"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setPrenom(event.target.value);}}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email-textfield"
            label="Email"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setEmail(event.target.value);}}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="password-textfield"
            label="Mot de passe"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setPassword(event.target.value);}}
          />
          <Button
            variant="outlined"
            type="submit"
            fullWidth
            sx={{ textTransform: 'none'}}
          >
            Créer le compte
          </Button>
        </Box>
      </Container>
    </>
  )
}
