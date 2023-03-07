import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import { Dialog, DialogTitle, DialogContent, Typography, Stack, DialogActions, Button, TableCell, TableRow, MenuItem, Select, TextField, SelectChangeEvent, Alert, Box } from '@mui/material';
import axios, { AxiosError } from 'axios';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import Jeu from '../../models/Jeu';
import Zone from "../../models/Zone";
import { Type } from '../../models/Type';
import '../../styles/App.css';
import '../../styles/Jeu.css';

export default function JeuItem(props: { isAdmin: boolean, jeu: Jeu, listZone: Zone[], onClickDelete: (id: number) => void}){
    const jeu = props.jeu;
    if(jeu.zones === undefined)
        jeu.zones = []

    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    const [openModify, setOpenModify] = useState(false);

    const [error, setError] = useState<AxiosError | null>(null);
    const [success, setSuccess] = useState<String | null>(null);

    const [nom, setNom] = useState<string>(jeu.nom_jeu);
    const [type, setType] = useState<Type>(jeu.type_jeu);
    const [zones, setZones] = useState<Zone[]>(props.listZone);

    const [selectedZone, setSelectedZone] = useState<number>(-1);
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

    const handleDelete = () => {
        axios.delete("http://localhost:3333/jeu/"+jeu.id_jeu)
        .then(() => {
            props.onClickDelete(jeu.id_jeu)
            navigate('/jeux')
        })
        
    }
    const handleAffectation = () => {
        if(selectedZone !== -1) {
            const data = {
                id_jeu: jeu.id_jeu,
                id_zone: selectedZone
            };
            axios.post("http://localhost:3333/zone/jeu", data)
            .then(res => {
                let z : Zone | undefined = zones.find(z => z.id_zone === selectedZone);
                if(z !== undefined){
                    jeu.zones.push(z);
                    setZones(zones.filter(zone => zone.id_zone !== selectedZone))
                }
                setSelectedZone(-1);
                setSuccess("Affectation réussie");
            })
            .catch((error : AxiosError) => {
                setError(error);
            })
        }
    }
    const handleRemoveAffectation = (id_zone: number) => {
        axios.delete("http://localhost:3333/zone/"+id_zone+"/"+jeu.id_jeu)
        .then(res => {
            let z : Zone | undefined = jeu.zones.find(z => z.id_zone === id_zone);
            if(z !== undefined){
                jeu.zones = jeu.zones.filter(zone => zone.id_zone !== id_zone)
                let listZone : Zone[] = zones;
                listZone.push(z)
                setZones(listZone)
            }
            setSuccess("Suppression réussie");
        })
        .catch((error : AxiosError) => {
            setError(error);
        })
    }

    useEffect(() => {
        //Retirer de la liste des zones, les zones où le jeu est déjà affecté
        let listIdZone : Number[] = []
        jeu.zones.forEach((z : Zone) => {
            listIdZone.push(z.id_zone)
        });
        

        let listZone : Zone[] = []
        listZone.push(new Zone(-1, "Aucune sélectionnée", [], []))
        listZone = props.listZone.filter((z : Zone) =>  !listIdZone.includes(z.id_zone) && z.id_zone !== -1)
        setZones(listZone);
        
    }, [jeu.zones])

    return (
        <>
            <TableRow
                key={jeu.id_jeu}
            >
                <TableCell component="th" scope="row">
                {nom}
                </TableCell>
                <TableCell align="right">
                    <Button onClick={() => { setOpen(true); }} className="boutonJeu">
                        <VisibilityIcon/>
                    </Button>
                    <Dialog
                        open={open}
                        onClose={() => { setOpen(false); setOpenModify(false); }}
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
                                    <Stack direction="row">
                                        <Stack direction="column" spacing={2}>
                                            <Typography>Type du jeu : {type}</Typography>
                                            {jeu.zones.length === 0 && 
                                                <Typography>Pas d'affectation</Typography>
                                            }
                                            {jeu.zones.length > 0 &&
                                                <>
                                                    <Typography>Affectation :</Typography>
                                                    {jeu.zones.map((zone:Zone) => (
                                                        <Stack key={"jeu-zone-"+jeu.id_jeu+zone.id_zone} direction="row">
                                                            <Typography >{zone.nom_zone}</Typography>
                                                            {props.isAdmin &&
                                                                <Button onClick={() => handleRemoveAffectation(zone.id_zone)} className="boutonJeu">
                                                                    <DeleteIcon/>
                                                                </Button>
                                                            }
                                                        </Stack>
                                                    ))}
                                                </>
                                            }
                                        </Stack>
                                        {props.isAdmin && 
                                            <Stack direction="column">
                                                <p>Zone : </p>
                                                <Select
                                                    value={String(selectedZone)}
                                                    onChange={(event: SelectChangeEvent) => { setSelectedZone(Number(event.target.value)); }}
                                                    >
                                                    {zones.map((i:any) => (
                                                        <MenuItem key={i.id_zone+"-"+i.nom_zone} value={i.id_zone}>{i.nom_zone}</MenuItem>
                                                    ))}
                                                </Select>
                                                <Button
                                                    className="boutonJeu"
                                                    type="submit"
                                                    fullWidth
                                                    variant="contained"
                                                    onClick={handleAffectation}
                                                >
                                                    Affecter
                                                </Button>
                                            </Stack>
                                        }
                                    </Stack>
                                </DialogContent>
                                <DialogActions>
                                    {props.isAdmin &&
                                        <>
                                            <Button onClick={() => { setOpenModify(true); }} className="boutonJeu">
                                                <EditIcon/>
                                            </Button>
                                            <Button onClick={handleDelete} className="boutonJeu">
                                                <DeleteIcon/>
                                            </Button>
                                        </>
                                    }
                                    <Button onClick={() => { setOpen(false); setOpenModify(false); }} className='boutonJeu'>Fermer</Button>
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
                                            className="boutonJeu"
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                        >
                                            Modifier le jeu
                                        </Button>
                                    </Box>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={() => { setOpen(false); setOpenModify(false); }} className="boutonJeu">Fermer</Button>
                                    <Button onClick={handleDelete} className="boutonJeu">
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