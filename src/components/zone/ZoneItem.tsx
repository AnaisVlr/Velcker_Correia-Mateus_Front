import { useState, useEffect } from "react";

import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Paper, Box, Dialog, DialogTitle, DialogContent, Typography, Stack, DialogActions, Button, MenuItem, Select, SelectChangeEvent, Alert } from '@mui/material';
import axios, { AxiosError } from 'axios';

import { Type } from '../../models/Type';
import Zone from "../../models/Zone";
import Jeu from "../../models/Jeu";

export default function ZoneItem(props: { isAdmin: boolean, zone: Zone, listJeux: Jeu[] }) {
  const zone = props.zone;
  if(zone.jeux === undefined)
    zone.jeux = [];
  

  const [open, setOpen] = useState(false);
  
  const [error, setError] = useState<AxiosError | null>(null);
  const [success, setSuccess] = useState<String | null>(null);

  const [jeux, setJeux] = useState<Jeu[]>(props.listJeux)
  const [selectedJeu, setSelectedJeu] = useState<number>(-1);

  const handleAffectation = () => {
    if(selectedJeu !== -1) {
      const data = {
        id_jeu: selectedJeu,
        id_zone: zone.id_zone
      };
      axios.post("https://velcker-correia-mateus-api-mobile.cluster-ig3.igpolytech.fr/zone/jeu", data)
        .then(res => {
          let j : Jeu | undefined = jeux.find(j => j.id_jeu === selectedJeu);
          if(j !== undefined){
            zone.jeux.push(j);
            setJeux(jeux.filter(jeu => jeu.id_jeu !== selectedJeu))
          }
          setSelectedJeu(-1);
          setSuccess("Affectation réussie");
        })
        .catch((error : AxiosError) => {
          error.message = "Erreur lors de la tentative d'affectation : "+error.message
          setError(error);
        })
    }
  }
  const handleRemoveAffectation = (id_jeu: number) => {
    axios.delete("https://velcker-correia-mateus-api-mobile.cluster-ig3.igpolytech.fr/zone/"+zone.id_zone+"/"+id_jeu)
      .then(res => {
        let j : Jeu | undefined = zone.jeux.find(j => j.id_jeu === id_jeu);
        if(j !== undefined){
          zone.jeux = zone.jeux.filter(jeu => jeu.id_jeu !== id_jeu)
          let listJeu : Jeu[] = jeux;
          listJeu.push(j)
          setJeux(listJeu)
        }
        setSuccess("Suppression réussie");
      })
      .catch((error : AxiosError) => {
        error.message = "Erreur lors de la tentative de suppression : "+error.message
        setError(error);
      })
  }

  useEffect(() => {
    //Retirer de la liste des zones, les zones où le jeu est déjà affecté
    let listIdJeu : Number[] = []
    zone.jeux.forEach((j : Jeu) => {
      listIdJeu.push(j.id_jeu)
    });
  

    let listJeu : Jeu[] = []
    listJeu.push(new Jeu(-1, "", Type.AMBIANCE, []))
    listJeu = props.listJeux.filter((j : Jeu) =>  !listIdJeu.includes(j.id_jeu))
    setJeux(listJeu);
    
  }, [zone.jeux])

  return (
    <Paper variant="outlined" sx={{ width: 200, height: 200}}>
      <Button onClick={() => { setOpen(true); }} sx={{textTransform:'none', height:'100%', width:'100%'}}>
        <Box className="zoneName" >
          {zone.nom_zone}
        </Box>
      </Button>
      <Dialog
        open={open}
        onClose={() => { setOpen(false); }}
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
        <>
          <DialogTitle>
              {zone.nom_zone}
          </DialogTitle>
          <DialogContent>
              <Stack direction="row" spacing={10}>
                <Stack direction="column" spacing={2}>
                  {zone.jeux.length === 0 && 
                    <Typography>Pas d'affectation</Typography>
                  }
                  {zone.jeux.length > 0 &&
                    <>
                      <Typography>Jeux affectés :</Typography>
                      {zone.jeux.map((jeu:Jeu) => (
                        <Stack key={"zone-jeu"+jeu.id_jeu+zone.id_zone} direction="row">
                          <Typography >{jeu.nom_jeu}</Typography>
                          {props.isAdmin &&
                            <Button onClick={() => handleRemoveAffectation(jeu.id_jeu)}>
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
                  <p>Affecter un autre jeu : </p>
                  <Select
                    value={String(selectedJeu)}
                    onChange={(event: SelectChangeEvent) => { setSelectedJeu(Number(event.target.value)); }}
                  >
                    {jeux.map((i:Jeu) => (
                      <MenuItem key={i.id_jeu+"-"+i.nom_jeu} value={i.id_jeu}>{i.nom_jeu}</MenuItem>
                    ))}
                  </Select>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    onClick={handleAffectation}
                    sx={{textTransform: 'none'}}
                  >
                    Affecter
                  </Button>
                </Stack>
              }
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => { setOpen(false); }} className='boutonJeu'>Fermer</Button>
          </DialogActions>
        </>
      </Dialog>
    </Paper>
  )
}
