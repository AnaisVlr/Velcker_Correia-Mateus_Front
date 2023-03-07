import '../../styles/BenevoleList.css'
import '../../styles/App.css';

import React from 'react'
import axios, {AxiosError} from "axios";

import { Accordion, AccordionDetails, AccordionSummary, Button, Box, Container, Modal, Stack, Alert, Typography, Divider } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DeleteIcon from '@mui/icons-material/Delete';

import BenevoleWithCreneaux from '../../models/BenevoleWithCreneaux';
import CreneauListItem from './CreneauListItem';
import Creneau from '../../models/Creneau';

interface typeProps {
  benevole: BenevoleWithCreneaux,
  isConnectedUserAdmin: boolean,
  onClickDelete: (id: number) => void
}

export default function BenevoleListItem(props: typeProps) {
  const b : BenevoleWithCreneaux = props.benevole;
  
  const [errorDelete, setErrorDelete] = React.useState<AxiosError | null>(null);
  const [openDelete, setOpenDelete] = React.useState(false);
  const onClickDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [creneaux, setCreneaux] = React.useState<Creneau[]>(b.creneaux);
  const handleChange= () => {
    setExpanded(!expanded);
  }
  const onConfirmDelete = () => {
    axios.delete("http://localhost:3333/benevole/"+b.id_benevole)
    .then(() => {
      props.onClickDelete(b.id_benevole)
    })
    .catch((error : AxiosError) => {
      error.message = "Erreur lors de la tentative de suppression : "+error.message;
      setErrorDelete(error);
    });
  }
  const handleDeleteCreneau = (id_zone: number, debut: Date) => {
    const newList = creneaux.filter((item) => new Date(item.debut).getTime() !== debut.getTime());
    setCreneaux(newList);
  }

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '33%',
    border: '1px solid black',
    backgroundColor: 'white',
    padding: '10px'
    /*boxShadow: 24,
    p: 4,*/
  };

  return (
    <Accordion expanded={expanded} onChange={handleChange}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
      >
        <Stack direction="row" spacing={3} sx={{alignItems:'center'}}>
          <Typography>
            {b.nom_benevole +" "+ b.prenom_benevole}
          </Typography>
          {props.isConnectedUserAdmin &&
            <Button sx={{textTransform: 'none'}} variant="outlined" endIcon={<DeleteIcon />} onClick={() => onClickDelete()}>
              Supprimer
            </Button>
          }
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
          {creneaux.length === 0 &&
            <p>Aucunes zones affectées </p>
          }
          {creneaux.map((creneau) => (
          <>
            <CreneauListItem creneau={creneau} isConnectedUserAdmin={props.isConnectedUserAdmin} onClickDelete={handleDeleteCreneau} key={b.id_benevole+"-"+creneau.zone.id_zone+"-"+creneau.debut}/>
            <Divider />
          </>
          ))}
      </AccordionDetails>
      <Modal
          open={openDelete}
          onClose={handleCloseDelete}
        >
          <Container>
            {errorDelete &&
              <Alert onClose={() => {setErrorDelete(null)}} severity="error">
                {errorDelete.message}
              </Alert>
            }
            <Box sx={style}>
              <Typography>Voulez-vous vraiment supprimer le compte de {b.nom_benevole +" "+ b.prenom_benevole} ?</Typography>
              <Button variant="outlined" sx={{textTransform: 'none'}} onClick={() => onConfirmDelete()}>Confirmer</Button>
              <Button variant="outlined" sx={{textTransform: 'none'}} onClick={() => setOpenDelete(false)}>Annuler</Button>
            </Box>
          </Container>
        </Modal>
    </Accordion>
  )
}
