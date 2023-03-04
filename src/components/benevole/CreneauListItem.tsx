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

  const [error, setError] = useState<AxiosError | null>(null);
  const [success, setSuccess] = useState<String | null>(null);

  const [open, setOpen] = React.useState(false);
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
  const handleChangeDebut = (newValue: Dayjs | null) => {
      setDebut(newValue);
    };
  const handleChangeFin = (newValue: Dayjs | null) => {
      setFin(newValue);
    };

  const onClickUpdate = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onClickDelete = () => {
    const data = {
      id_benevole: c.benevole.id_benevole,
      id_zone: c.zone.id_zone,
      debut: debut,
      fin: fin
    }
    
   axios.delete("http://localhost:3333/zone/creneau", {data})
    .then(() => {
      props.onClickDelete(c.zone.id_zone, new Date(c.debut))
      setSuccess("Suppression réussie !")
    })
    .catch((error : AxiosError) => {
      error.message = "Erreur lors de la tentative de suppression : "+error.message
      setError(error);
    });
  };
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
        setError(error);
      });
    }
  };

  return (
    <Container sx={{m: 2}}>
      {success &&
        <Alert onClose={() => {setSuccess(null)}} severity="success">
          {success}
        </Alert>
      }
      <Stack direction="column">
        <Typography>Zone affectée : {c.zone.nom_zone}</Typography>
        <Typography> De {dayjs(new Date(c.debut)).format('LLLL')}</Typography>
        <Typography> À {dayjs(new Date(c.fin)).format('LLLL')}</Typography>
      </Stack>

      {props.isConnectedUserAdmin &&
      <>
        <Button className='bouton' variant="outlined" onClick={() => onClickUpdate()}>
          <EditIcon />
        </Button>
        <Button className='bouton' variant="outlined" onClick={() => onClickDelete()}>
          <DeleteIcon />
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Container>
            {error &&
              <Alert onClose={() => {setError(null)}} severity="error">
                {error.message}
              </Alert>
            }
            <Box sx={style}>
                Modification des dates
              <LocalizationProvider adapterLocale={'fr'} dateAdapter={AdapterDayjs}>
                <Stack direction="column" component="form" noValidate spacing={3}>
                  <DateTimePicker
                    label="Début"
                    value={debut}
                    onChange={handleChangeDebut}
                    renderInput={(params) => <TextField {...params} />}
                  />
                  <DateTimePicker
                    label="Fin"
                    value={fin}
                    onChange={handleChangeFin}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </Stack>
              </LocalizationProvider>
              <Button className='bouton' onClick={() => onConfirmUpdate()}>Confirmer</Button>
            </Box>
          </Container>
        </Modal>
      </>
      }
    </Container>
  )
}
