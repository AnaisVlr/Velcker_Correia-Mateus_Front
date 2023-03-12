import '../styles/Home.css';
import React from 'react'
import { decodeToken, isExpired } from 'react-jwt';
import { useEffect, useState } from "react";
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {Stack, TextField, Box, Button, Divider, Paper, Grid, Toolbar} from '@mui/material';
import Navigation from './Navigation';

export default function NavigationBar(props: { page: String; }) {
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
    
    const data = {
      "email_benevole": email,
      "password_benevole": password
    }

    axios.post("https://velcker-correia-mateus-api-mobile.cluster-ig3.igpolytech.fr/auth/signin", data)
    .then(res => {
      console.log(res);
      localStorage.setItem("access_token", res.data.access_token);
      axios.defaults.headers.common['Authorization'] = "Bearer "+res.data.access_token;
      setIsConnected(true)
    }).catch((error) => {
      console.log(error);
    })
  }

  useEffect(() => {
    //Vérifie que la session utilisateur est correcte
    authentificationValid()

  }, [isConnected])

  if(isConnected)
    return (
      <>
        <Toolbar disableGutters>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex'} }}>
            <Link to="/">
              Accueil FJM
            </Link>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            <div>
              <Stack
                direction="row"
                divider={<Divider orientation="vertical" flexItem />}
                spacing={2}
                sx={{alignItems:'center'}}
              >
                <Link to={"/profil/"+email }>
                    Mon profil
                </Link>
                <Button variant="contained" sx={{textTransform:'none'}} onClick={handleDisconnect}>
                  Se déconnecter
                </Button>
              </Stack>
            </div>
          </Box>
        </Toolbar>
        <Navigation page={props.page}></Navigation>
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
          sx={{color: 'primary.light'}}
          label="Mot de passe"
          type='password'
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setPassword(event.target.value);}}
        />
        <Button
          type="submit"
          fullWidth
          variant="outlined"
          sx={{textTransform: 'none'}}
        >
          Se connecter
        </Button>
      </Box>
      </>
    )
}
