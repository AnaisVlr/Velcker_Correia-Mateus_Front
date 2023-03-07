import '../styles/HomePage.css';
import '../styles/App.css';
import React from 'react'
import { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios, { AxiosError } from "axios";
import { decodeToken, isExpired } from 'react-jwt';
import {Stack, TextField, Box, Button, Divider, Typography, Avatar, Container, Alert} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

export default function HomePage() {
  const [error, setError] = useState<AxiosError | null>(null);

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const navigate = useNavigate();

  //Vérifie que la session utilisateur est correcte
  const authentificationValid = () => {
    const token = localStorage.getItem('access_token');
    let stillValid = false
    if(token != null) { //Si un token était enregistré
      if(decodeToken(token) != null) { //Si le token est valide (bien codé)
        if(!isExpired(token)) { //Et s'il a expiré
          stillValid = true
          setIsConnected(true)
          let decoded : any = decodeToken(token)
          setEmail(decoded.email)
        }else{
          setIsConnected(false)
        }
      }
    }

    if(!stillValid) { //Si expiré, on revient à l'accueil
      navigate('/')
    }
  }

  const handleDisconnect = () => {
    localStorage.removeItem("access_token")
    setIsConnected(false)
  }

  const handleSubmitSignIn = (event: any) => {
    event.preventDefault();

    if(email.length === 0 || password.length === 0) {
      setError(new AxiosError("Remplissez tous les champs"));
    }
    else {
      const data = {
        "email_benevole": email,
        "password_benevole": password
      }
  
      axios.post("http://localhost:3333/auth/signin", data)
      .then(res => {
        localStorage.setItem("access_token", res.data.access_token);
        axios.defaults.headers.common['Authorization'] = "Bearer "+res.data.access_token;
        setIsConnected(true)
      }).catch((error) => {
        if(error.response){
          if(error.response.data)
            error.message = "Erreur lors de la tentative de connexion : "+error.response.data.message;
        } else error.message = "Erreur lors de la tentative de connexion : "+error;
        setError(error)
      })
    }
  }

  useEffect(() => {
    authentificationValid();
  }, [isConnected])
  
  if(isConnected){
    return (
      <div className='homePage'>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent : 'flex-end', textAlign: 'center' }}>
          <div>
            <Stack
              direction="row"
              divider={<Divider orientation="vertical" flexItem />}
              spacing={2}
            >
              <Link to={"/profil/"+email }>
                  Mon profil
              </Link>
              <button onClick={handleDisconnect}>
                Se déconnecter
              </button>
            </Stack>
          </div>
        </Box>
        <h1>
          Festival de jeux de Montpellier 2023
        </h1>
        <Stack
          direction="row"
          divider={<Divider orientation="vertical" flexItem />}
          justifyContent="space-around"
          alignItems="center" 
          spacing={3}
        >
          <div id="divJeux">
            <Link to="/jeux">
              Jeux
            </Link>
          </div>
          <div id="divZones">
            <Link to="/zones">Zones</Link>
          </div>
          <div id="divBenevoles">
          <Link to="/benevoles">Bénévoles</Link>
          </div>
        </Stack>
      </div>
    )
  }else{
    return (
      <div className="homePage">
        <Container component="main" maxWidth="xs">
          <Box
            component="form"
            onSubmit={handleSubmitSignIn}
            noValidate
            sx={{
              paddingTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            >
            <Avatar sx={{ m: 1, bgcolor: 'warning.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Connexion
            </Typography>
            <TextField
              margin="normal"
              required
              fullWidth
              color='primary'
              id="emailIn-textfield"
              name="email"
              label="Email"
              autoComplete="email"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setEmail(event.target.value);}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              color='primary'
              id="passwordIn-textfield"
              label="Mot de passe"
              autoComplete="current-password"
              type='password'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setPassword(event.target.value);}}
            />
            <Button
              className='bouton'
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, textTransform: 'none' }}
            >
              Se connecter
            </Button>
            {error &&
            <Alert onClose={() => {setError(null)}} severity="error">
              {error.message}
            </Alert>
          }
          </Box>
        </Container>
      </div>
    )
  }
}