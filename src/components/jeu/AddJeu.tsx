import { Alert, Box, Stack, TextField, Button, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Type } from "../../models/Type";
import '../../styles/App.css';
import '../../styles/Jeu.css';

export default function AddJeu() {
    const [error, setError] = useState<AxiosError | null>(null);
    const [success, setSuccess] = useState<String | null>(null);

    const [nom, setNom] = useState<string>("");
    const [type, setType] = useState<Type>(Type.FAMILLE);

    const [selectedType, setSelectedType] = useState<string>("");

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedType(event.target.value);
        switch(event.target.value) {
            case "ambiance":
                setType(Type.AMBIANCE);
                break
            case "enfant":
                setType(Type.ENFANT);
                break
            case "expert":
                setType(Type.ENFANT);
                break
            case "famille":
                setType(Type.FAMILLE);
                break
            case "initie":
                setType(Type.INITIE);
                break
        }
    };

    const handleSubmit = (event: any) => {
        event.preventDefault();
        
        if(nom.length === 0) {
        setError(new AxiosError("Tous les champs doivent être remplis !"))
        }
        else {
        const data = {
            "nom_jeu": nom,
            "type_jeu": type
        }
    
        axios.post("http://localhost:3333/jeu", data)
        .then(res => {
            setSuccess("Création réussie")
            setNom("")
            setSelectedType("")
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
        <Link to="/jeux">Retour</Link>

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
                <Select
                    id="type-select"
                    value={selectedType}
                    label="Type"
                    onChange={handleChange}
                >
                    <MenuItem value="ambiance">Ambiance</MenuItem>
                    <MenuItem value="enfant">Enfant</MenuItem>
                    <MenuItem value="expert">Expert</MenuItem>
                    <MenuItem value="famille">Famille</MenuItem>
                    <MenuItem value="initie">Inité</MenuItem>
                </Select>
                <Button
                    className="boutonJeu"
                    type="submit"
                    fullWidth
                    variant="contained"
                >
                    Créer le jeu
                </Button>
            </Stack>
        </Box>
    </>
  )
}