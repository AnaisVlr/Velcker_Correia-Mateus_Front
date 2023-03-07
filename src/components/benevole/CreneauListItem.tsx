import '../../styles/BenevoleList.css'
import '../../styles/App.css';

import React from 'react'
import { useState } from "react";
import axios, { AxiosError } from "axios";
import Creneau from '../../models/Creneau'

import { Button, Container, Modal, Stack, Alert, Box, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/fr';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface typeProps {
  creneau: Creneau,
  isConnectedUserAdmin: boolean,
  onClickDelete: (id_zone: number, debut: Date) => void
}

export default function CreneauListItem(props: typeProps) {
  const c : Creneau = props.creneau
  dayjs.locale('fr');

  const [errorUpdate, setErrorUpdate] = useState<AxiosError | null>(null);
  const [errorDelete, setErrorDelete] = useState<AxiosError | null>(null);
  const [success, setSuccess] = useState<String | null>(null);

  const [openUpdate, setOpenUpdate] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);
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

  const [debut, setDebut] = useState<Dayjs | null>(dayjs(c.debut));
  const [fin, setFin] = useState<Dayjs | null>(dayjs(c.fin));

  const onConfirmUpdate = () => {

    if(!dayjs(c.debut).isSame(debut) || !dayjs(c.fin).isSame(fin)) {
      const data = {
        id_benevole: c.benevole.id_benevole,
        id_zone: c.zone.id_zone,
        debut_old: c.debut,
        debut_new: debut,
        fin: fin
      }
      axios.put("http://localhost:3333/zone/creneau", data)
      .then(() => {
        if(debut)
          c.debut = debut.toDate()
        if(fin)
          c.fin = fin.toDate()
        setSuccess("Modification effectuée !")
      })
      .catch((error : AxiosError) => {
        error.message = "Erreur lors de la tentative de modification : "+error.message
        setErrorUpdate(error);
      });
    }
    else {
      setOpenUpdate(false)
    }
  };
  const onConfirmDelete = () => {
    const data = {
      id_benevole: c.benevole.id_benevole,
      id_zone: c.zone.id_zone,
      debut: c.debut,
      fin: c.fin
    };
    
   axios.delete("http://localhost:3333/zone/creneau", {data})
    .then(() => {
      props.onClickDelete(c.zone.id_zone, new Date(c.debut));
      setSuccess("Suppression réussie !");
    })
    .catch((error : AxiosError) => {
      error.message = "Erreur lors de la tentative de suppression : "+error.message;
      setErrorDelete(error);
    });
  }

  return (
    <Container sx={{m: 2}}>
      {success &&
        <Alert onClose={() => {setSuccess(null)}} severity="success">
          {success}
        </Alert>
      }
      <Stack direction="column" sx={{m:1}}>
        <Typography>Zone affectée : {c.zone.nom_zone}</Typography>
        <Typography sx={{paddingLeft:2}}> Du : {dayjs(new Date(c.debut)).format('LT') +" le "+ dayjs(new Date(c.debut)).format('LL')}</Typography>
        <Typography sx={{paddingLeft:2}}> Au :   {dayjs(new Date(c.fin)).format('LT') +" le "+ dayjs(new Date(c.fin)).format('LL')}</Typography>
      </Stack>

      {props.isConnectedUserAdmin &&
      <>
        <Stack direction="row" spacing={1}>
          <Button sx={{textTransform: 'none'}} variant="outlined" onClick={() => { setOpenUpdate(true) }}>
            <EditIcon />
          </Button>
          <Button sx={{textTransform: 'none'}} variant="outlined" onClick={() => { setOpenDelete(true) }}>
            <DeleteIcon />
          </Button>
        </Stack>
        <>
          <Modal
            open={openUpdate}
            onClose={() => { setOpenUpdate(false) }}
          >
            <Container>
              {errorUpdate &&
                <Alert onClose={() => {setErrorUpdate(null)}} severity="error">
                  {errorUpdate.message}
                </Alert>
              }
              <Box sx={style}>
                  Modification des dates
                <LocalizationProvider adapterLocale={'fr'} dateAdapter={AdapterDayjs}>
                  <Stack direction="column" component="form" noValidate spacing={3} sx={{m:2}}>
                    <DateTimePicker
                      label="Début"
                      value={debut}
                      onChange={(newValue: Dayjs | null) => { setDebut(newValue); }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    <DateTimePicker
                      label="Fin"
                      value={fin}
                      onChange={(newValue: Dayjs | null) => { setFin(newValue); }}
                      renderInput={(params) => <TextField {...params} />}
                    />
                  </Stack>
                </LocalizationProvider>
                <Button variant="outlined" sx={{textTransform: 'none'}} onClick={() => onConfirmUpdate()}>Confirmer</Button>
              </Box>
            </Container>
          </Modal>
        </>
        <Modal
          open={openDelete}
          onClose={() => { setOpenDelete(false) }}
        >
          <Container>
            {errorDelete &&
              <Alert onClose={() => {setErrorDelete(null)}} severity="error">
                {errorDelete.message}
              </Alert>
            }
            <Box sx={style}>
              <Typography>Voulez-vous vraiment supprimer ce créneau ?</Typography>
              <Button variant="outlined" sx={{textTransform: 'none'}} onClick={() => onConfirmDelete()}>Confirmer</Button>
              <Button variant="outlined" sx={{textTransform: 'none'}} onClick={() => setOpenDelete(false)}>Annuler</Button>
            </Box>
          </Container>
        </Modal>
      </>
      }
    </Container>
  )
}
