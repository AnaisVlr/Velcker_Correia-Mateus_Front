import '../styles/App.css';

import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from 'react-router-dom';

import { List, ListItem, ListItemText, TextField, Box, Button, Alert, Stack, Container } from "@mui/material";
import Benevole from "../models/Benevole";

export default function Profil() {
  
  const { user } = useParams()

  const [error, setError] = useState<AxiosError | null>(null);
  const [success, setSuccess] = useState<String | null>(null);

  const [nom, setNom] = useState<string>("");
  const [prenom, setPrenom] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [old_password, setOld_password] = useState<string>("");
  const [new_password, setNew_password] = useState<string>("");
  const [confirm_password, setConfirm_password] = useState<string>("");

  const handleSubmitPassword = (event: any) => {
    event.preventDefault();
    
    if(old_password.length === 0 || new_password.length === 0 || confirm_password.length === 0 ) {
      setError(new AxiosError("Tous les champs doivent être remplis !"))
    }
    else if(new_password !== confirm_password) {
      setError(new AxiosError("La confirmation ne correspond pas"))
    }
    else {
      const data = {
        "email_benevole": email,
        "old_password_benevole": old_password,
        "new_password_benevole": new_password
      }
  
      axios.put("http://localhost:3333/benevole/password", data)
      .then(res => {
        setSuccess("Modification réussie")
      }).catch((error) => {
        if(error.response){
          if(error.response.data)
            error.message = "Erreur lors du changement de mot de passe : "+error.response.data.message
        } else error.message = "Erreur lors du changement de mot de passe : "+error
        setError(error)
      })
    }
  }

  useEffect(() => {

    axios.get<Benevole>("http://localhost:3333/benevole/email/"+user)
    .then(res => {
      const data = res.data
      setEmail(data.email_benevole)
      setNom(data.nom_benevole)
      setPrenom(data.prenom_benevole)
    })
    .catch((error : AxiosError) => {
      setError(error);
    });
    
    
  }, [user])

  return (
    <Container>
      <Container maxWidth="xs">
        <List
          sx={{
            width: '100%',
            maxWidth: 360,
            bgcolor: 'background.paper',
          }}
          >
          <ListItem>
            <ListItemText primary="Nom" secondary={nom} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Prénom" secondary={prenom} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" secondary={email} />
          </ListItem>
        </List>
      </Container>


      <Container maxWidth="xs">
        <h1>Changement de mot de passe</h1>
        <Box
          component="form"
          onSubmit={handleSubmitPassword}
          noValidate
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          >
          <Stack direction="column">
            <TextField
              margin="normal"
              required
              fullWidth
              id="old-textfield"
              label="Ancien mot de passe"
              type='password'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setOld_password(event.target.value);}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="new-textfield"
              label="Nouveau mot de passe"
              type='password'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setNew_password(event.target.value);}}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="confirm-textfield"
              label="Confirmation"
              type='password'
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setConfirm_password(event.target.value);}}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Modifier le mot de passe
            </Button>
          </Stack>
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
        </Box>
      </Container>
    </Container>
  )
}
