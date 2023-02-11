import TextField from '@mui/material/TextField';
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import React from 'react'
import { useEffect, useState } from "react";
import {Link} from 'react-router-dom';
import axios from 'axios';
import { decodeToken } from 'react-jwt';

export default function HomeComponent() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmedPassword, setConfirmedPassword] = useState<string>("");

  const handleDisconnect = () => {
    localStorage.removeItem("access_token")
    setIsConnected(false)
  }
  const handleSubmitSignIn = (event: any) => {
    event.preventDefault();
    
    const data = {
      "email_benevole": email,
      "password_benevole": password
    }

    axios.post("http://localhost:3333/auth/signin", data)
    .then(res => {
      console.log(res);
      localStorage.setItem("access_token", res.data.access_token);
      axios.defaults.headers.common['Authorization'] = "Bearer "+res.data.access_token;
      setIsConnected(true)
    }).catch((error) => {
      console.log(error);
    })
  }
  const handleSubmitSignUp = (event: any) => {
    event.preventDefault();
    
    const data = {
      "nom_benevole": nom,
      "prenom_benevole": prenom,
      "email_benevole": email,
      "password_benevole": password
    }

    axios.post("http://localhost:3333/auth/signup", data)
    .then(res => {
      console.log(res);
    }).catch((error) => {
      console.log(error);
    })
  }

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if(token != null)
      if(decodeToken(token) != null) //Si token valide
        setIsConnected(true)

  }, [isConnected])

  if(isConnected)
    return (
      <>
        <Button
          color="secondary"
          onClick={handleDisconnect}>
          Déconnexion
        </Button>
        <h1>Bonjour</h1>
        <Link to="/jeux">Jeux</Link>
        <Link to="benevoles">Bénévoles</Link>
      </>
    )
  else
    return (
      <>
      <Box
        component="form"
        onSubmit={handleSubmitSignIn}
        noValidate
      >
        <TextField
          id="emailIn-textfield"
          required
          name="email"
          label="Email"
          autoComplete="email"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setEmail(event.target.value);}}
        />
        <TextField
          id="passwordIn-textfield"
          required
          label="Mot de passe"
          type='password'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setPassword(event.target.value);}}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
        >
          Se connecter
        </Button>
      </Box>

      <Box
        component="form"
        onSubmit={handleSubmitSignUp}
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
          name="email"
          autoComplete="email"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setEmail(event.target.value);}}
        />
        <TextField
          id="password-textfield"
          required
          label="Mot de passe"
          type='password'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setPassword(event.target.value);}}
        />
        <TextField
          id="confirmedPassword-textfield"
          required
          label="Confirmer le mot de passe"
          type='password'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setConfirmedPassword(event.target.value);}}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
        >
          S'inscrire
        </Button>
      </Box>
      </>
    )
}
