import '../../styles/BenevoleList.css'

import React from 'react'
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import Benevole from "../../models/Benevole";
import Zone from "../../models/Zone";

import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/fr';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FormControl, InputLabel } from '@mui/material';

export default function AddCreneau() {
  const [errorLoading, setErrorLoading] = useState<AxiosError | null>(null);
  const [error, setError] = useState<AxiosError | null>(null);
  const [success, setSuccess] = useState<String | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [benevoles, setBenevoles] = useState<Benevole[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  const [selectedBenevole, setSelectedBenevole] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [debut, setDebut] = useState<Dayjs | null>(dayjs('2023-01-01T00:00:00'));
  const [fin, setFin] = useState<Dayjs | null>(dayjs('2023-01-01T00:00:00'));

  const handleChangeDebut = (newValue: Dayjs | null) => {
    setDebut(newValue);
  };
  const handleChangeFin = (newValue: Dayjs | null) => {
    setFin(newValue);
  };
  const handleChangeZone = (event: SelectChangeEvent) => {
    setSelectedZone(event.target.value)
  };
  const handleChangeBenevole = (event: SelectChangeEvent) => {
    setSelectedBenevole(event.target.value);
  };

  const handleCreate = () => {
    if(selectedBenevole.length === 0 ||selectedZone.length === 0)
      setError(new AxiosError("Vous devez sélectionner un bénévole et une zone !"))
    else {
      const data = {
        id_benevole: selectedBenevole,
        id_zone: selectedZone,
        debut: debut,
        fin: fin
      }
      axios.post("http://localhost:3333/zone/creneau", data)
      .then(res => {
        setSuccess("Ajoute réussi !")
      }).catch((error) => {
        error.message = "Erreur lors de la tentative d'ajout : "+error.response.data.message
        setError(error)
      })
    }
  }
  useEffect(() => {
    axios.get<Benevole[]>("http://localhost:3333/benevole")
      .then(res => { 
        setBenevoles(res.data);

        axios.get<Zone[]>("http://localhost:3333/zone")
        .then(res => {
          setZones(res.data);
          setIsLoaded(true);
        })
      })
      .catch((error : AxiosError) => {
        setIsLoaded(true);
        setErrorLoading(error);
      })
      
  }, [])

  if (errorLoading) {
    return <div>Erreur : {errorLoading.message}</div>;
  } else if (!isLoaded) {
    return <div>Chargement...</div>;
  } else {
    return (
      <>
        <Link to="/benevoles">Voir la liste des bénévoles</Link>
        <Link to="/benevoles/addBenevole">Créer des comptes de bénévoles</Link>
        
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

        <Stack direction="column" spacing={3}>
          <FormControl>
            <InputLabel id="zone-name-label">Zone</InputLabel>
            <Select
              labelId="zone-name-label"
              value={selectedZone}
              onChange={handleChangeZone}
              displayEmpty
            >
              <MenuItem value=""></MenuItem>
              {zones.map((z) => (
                <MenuItem key={z.id_zone+"-"+z.nom_zone} value={z.id_zone}>{z.nom_zone}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <InputLabel id="benevole-name-label">Bénévole</InputLabel>
            <Select
              labelId="benevole-name-label"
              value={selectedBenevole}
              onChange={handleChangeBenevole}
              displayEmpty
            >
              <MenuItem value=""></MenuItem>
              {benevoles.map((b) => (
                <MenuItem key={b.id_benevole+"-"+b.nom_benevole} value={b.id_benevole}>{b.prenom_benevole+" "+b.nom_benevole}</MenuItem>
              ))}
            </Select>
          </FormControl>
          
          
          <LocalizationProvider adapterLocale={'fr'} dateAdapter={AdapterDayjs}>
            <Stack direction="column" spacing={3}>
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
        </Stack>

        <Button
          onClick={handleCreate}>
          Ajouter le créneau
        </Button>
      </>
    )
  }
}
