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
        setError(new AxiosError("Tous les champs doivent ??tre remplis !"))
        }
        else {
            const data = {
                "id_jeu": jeu.id_jeu.toString(),
                "nom_jeu": newName,
                "type_jeu": type
            }
        
            axios.put("https://velcker-correia-mateus-api-mobile.cluster-ig3.igpolytech.fr/jeu", data)
            .then(res => {
                setNom(newName)
                setSuccess("Modification r??ussie")
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
        axios.delete("https://velcker-correia-mateus-api-mobile.cluster-ig3.igpolytech.fr/jeu/"+jeu.id_jeu)
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
            axios.post("https://velcker-correia-mateus-api-mobile.cluster-ig3.igpolytech.fr/zone/jeu", data)
            .then(res => {
                let z : Zone | undefined = zones.find(z => z.id_zone === selectedZone);
                if(z !== undefined){
                    jeu.zones.push(z);
                    setZones(zones.filter(zone => zone.id_zone !== selectedZone))
                }
                setSelectedZone(-1);
                setSuccess("Affectation r??ussie");
            })
            .catch((error : AxiosError) => {
                setError(error);
            })
        }
    }
    const handleRemoveAffectation = (id_zone: number) => {
        axios.delete("https://velcker-correia-mateus-api-mobile.cluster-ig3.igpolytech.fr/zone/"+id_zone+"/"+jeu.id_jeu)
        .then(res => {
            let z : Zone | undefined = jeu.zones.find(z => z.id_zone === id_zone);
            if(z !== undefined){
                jeu.zones = jeu.zones.filter(zone => zone.id_zone !== id_zone)
                let listZone : Zone[] = zones;
                listZone.push(z)
                setZones(listZone)
            }
            setSuccess("Suppression r??ussie");
        })
        .catch((error : AxiosError) => {
            setError(error);
        })
    }

    useEffect(() => {
        //Retirer de la liste des zones, les zones o?? le jeu est d??j?? affect??
        let listIdZone : Number[] = []
        jeu.zones.forEach((z : Zone) => {
            listIdZone.push(z.id_zone)
        });
        

        let listZone : Zone[] = []
        listZone.push(new Zone(-1, "Aucune s??lectionn??e", [], []))
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
                    <Button onClick={() => { setOpen(true); }}>
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
                                    <Typography>Type du jeu : {type}</Typography>
                                    <Stack direction="row" spacing={10} sx={{alignItems:'center'}}>
                                        <Stack direction="column" spacing={2}>
                                            {jeu.zones.length === 0 && 
                                                <Typography>Pas d'affectation</Typography>
                                            }
                                            {jeu.zones.length > 0 &&
                                                <>
                                                    <Typography>Zone affect??es :</Typography>
                                                    {jeu.zones.map((zone:Zone) => (
                                                        <Stack key={"jeu-zone-"+jeu.id_jeu+zone.id_zone} direction="row">
                                                            <Typography >{zone.nom_zone}</Typography>
                                                            {props.isAdmin &&
                                                                <Button onClick={() => handleRemoveAffectation(zone.id_zone)}>
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
                                                <p>Affecter ?? une autre zone : </p>
                                                <Select
                                                    color='primary'
                                                    value={String(selectedZone)}
                                                    onChange={(event: SelectChangeEvent) => { setSelectedZone(Number(event.target.value)); }}
                                                    >
                                                    {zones.map((i:any) => (
                                                        <MenuItem key={i.id_zone+"-"+i.nom_zone} value={i.id_zone}>{i.nom_zone}</MenuItem>
                                                    ))}
                                                </Select>
                                                <Button
                                                    sx={{textTransform:'none'}}
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
                                            <Button onClick={() => { setOpenModify(true); }}>
                                                <EditIcon/>
                                            </Button>
                                            <Button onClick={handleDelete}>
                                                <DeleteIcon/>
                                            </Button>
                                        </>
                                    }
                                    <Button sx={{textTransform:'none'}} onClick={() => { setOpen(false); setOpenModify(false); }}>Fermer</Button>
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
                                            color='primary'
                                            label="Nom"
                                            value={newName}
                                            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setNewName(event.target.value);}}
                                        />
                                        <Select
                                            id="type-select"
                                            color='primary'
                                            value={selectedType}
                                            label="Type"
                                            onChange={handleChange}
                                        >
                                            <MenuItem value="AMBIANCE">Ambiance</MenuItem>
                                            <MenuItem value="ENFANT">Enfant</MenuItem>
                                            <MenuItem value="EXPERT">Expert</MenuItem>
                                            <MenuItem value="FAMILLE">Famille</MenuItem>
                                            <MenuItem value="INITIE">Init??</MenuItem>
                                        </Select>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{textTransform:'none'}}
                                        >
                                            Modifier le jeu
                                        </Button>
                                    </Box>
                                </DialogContent>
                                <DialogActions>
                                    <Button sx={{textTransform:'none'}} onClick={() => { setOpen(false); setOpenModify(false); }}>Fermer</Button>
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