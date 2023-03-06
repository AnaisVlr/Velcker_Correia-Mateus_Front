import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, TableCell, TableRow, MenuItem, Select, TextField, SelectChangeEvent, Alert, Box } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Jeu from '../../models/Jeu';
import { Type } from '../../models/Type';

export default function JeuItem(props: { isAdmin: boolean, jeu: Jeu, onClickDelete: (id: number) => void}){
    const jeu = props.jeu;

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);

    const [openModify, setOpenModify] = useState(false);

    const [error, setError] = useState<AxiosError | null>(null);
    const [success, setSuccess] = useState<String | null>(null);

    const [nom, setNom] = useState<string>(jeu.nom_jeu);
    const [type, setType] = useState<Type>(jeu.type_jeu);

    const [selectedType, setSelectedType] = useState<string>(jeu.type_jeu.toString());
    const [newName, setNewName] = useState<string>(nom);

    const handleChange = (event: SelectChangeEvent) => {
        setSelectedType(event.target.value);
        switch(event.target.value) {
            case "AMBIANCE":
                setType(Type.AMBIANCE);
                break
            case "ENFANT":
                setType(Type.ENFANT);
                break
            case "EXPERT":
                setType(Type.EXPERT);
                break
            case "FAMILLE":
                setType(Type.FAMILLE);
                break
            case "INITIE":
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
                "id_jeu": jeu.id_jeu.toString(),
                "nom_jeu": newName,
                "type_jeu": type
            }
        
            axios.put("http://localhost:3333/jeu", data)
            .then(res => {
                setNom(newName)
                setSuccess("Modification réussie")
            }).catch((error) => {
                if(error.response){
                if(error.response.data)
                    error.message = "Erreur lors de la tentative de modification : "+error.response.data.message
                } else error.message = "Erreur lors de la tentative de modification : "+error
                setError(error)
            })
        }
    }

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setOpenModify(false);
    };

    const handleModify = () => {
        setOpenModify(true);
    }

    const handleDelete = () => {
        axios.delete("http://localhost:3333/jeu/"+jeu.id_jeu)
        .then(() => {
            props.onClickDelete(jeu.id_jeu)
            navigate('/jeux')
        })
        
    }

    return (
        <>
            <TableRow
                key={jeu.id_jeu}
            >
                <TableCell component="th" scope="row">
                {nom}
                </TableCell>
                <TableCell align="right">
                    <Button onClick={handleClickOpen}>
                        <VisibilityIcon/>
                    </Button>
                    <Dialog
                        open={open}
                        onClose={handleClose}
                    >
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
                        {!openModify &&
                            <>
                                <DialogTitle>
                                    {nom}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Type du jeu : {type}
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    {props.isAdmin &&
                                        <>
                                            <Button onClick={handleModify}>
                                                <EditIcon/>
                                            </Button>
                                            <Button onClick={handleDelete}>
                                                <DeleteIcon/>
                                            </Button>
                                        </>
                                    }
                                    <Button onClick={handleClose}>Fermer</Button>
                                </DialogActions>
                            </>
                        }
                        {props.isAdmin && openModify &&
                            <>
                                <DialogContent>
                                    <Box
                                        component="form"
                                        onSubmit={handleSubmit}
                                        noValidate
                                    >
                                        <TextField
                                            id="nom-textfield"
                                            required
                                            label="Nom"
                                            value={newName}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setNewName(event.target.value);}}
                                        />
                                        <Select
                                            id="type-select"
                                            value={selectedType}
                                            label="Type"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="AMBIANCE">Ambiance</MenuItem>
                                            <MenuItem value="ENFANT">Enfant</MenuItem>
                                            <MenuItem value="EXPERT">Expert</MenuItem>
                                            <MenuItem value="FAMILLE">Famille</MenuItem>
                                            <MenuItem value="INITIE">Inité</MenuItem>
                                        </Select>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                        >
                                            Modifier le jeu
                                        </Button>
                                    </Box>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleClose}>Fermer</Button>
                                    <Button onClick={handleDelete}>
                                        <DeleteIcon/>
                                    </Button>
                                </DialogActions>
                            </>
                        }
                    </Dialog>
                </TableCell>
            </TableRow>
        </>
    );
}