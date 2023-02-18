import React from 'react'
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from 'react-jwt';

import Benevole from "../../models/Benevole";
import Zone from "../../models/Zone";

import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from "@mui/material/Button";
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/fr';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

export default function AddCreneau() {
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [benevoles, setBenevoles] = useState<Benevole[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  const [selectedBenevole, setSelectedBenevole] = useState<string>("");
  const [selectedZone, setSelectedZone] = useState<string>("");
  const [debut, setDebut] = useState<Dayjs | null>(dayjs('2023-01-01T00:00:00'));
  const [fin, setFin] = useState<Dayjs | null>(dayjs('2023-01-01T00:00:00'));

  const navigate = useNavigate();

  const handleDisconnect = () => {
    localStorage.removeItem("access_token")
    navigate('/');
  };

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
    //TO DO GESTION ERREUR (partout d'ailleurs)
    const data = {
      id_benevole: selectedBenevole,
      id_zone: selectedZone,
      debut: debut,
      fin: fin
    }
    axios.post("http://localhost:3333/zone/creneau", data)
    .then(res => {
      console.log(res);
    }).catch((error) => {
      console.log(error);
    })
  }
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if(token != null) { // S'il existe
      if(decodeToken(token) == null) //Si token invalide
        navigate('/');
    }
    else navigate('/');

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
        setError(error);
      })
      
  }, [])

  if (error) {
    return <div>Erreur : {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Chargement...</div>;
  } else {
    return (
      <>
        <Button
          color="secondary"
          onClick={handleDisconnect}>
          Déconnexion
        </Button>
        <Link to="/benevoles">Voir la liste des bénévoles</Link>
        <Link to="/benevoles/addBenevole">Créer des comptes de bénévoles</Link>
        <Select
          value={selectedZone}
          onChange={handleChangeZone}
          displayEmpty
        >
          <MenuItem value=""></MenuItem>
          {zones.map((z) => (
            <MenuItem key={z.id_zone+"-"+z.nom_zone} value={z.id_zone}>{z.nom_zone}</MenuItem>
          ))}
        </Select>
        <Select
          value={selectedBenevole}
          onChange={handleChangeBenevole}
          displayEmpty
        >
          <MenuItem value=""></MenuItem>
          {benevoles.map((b) => (
            <MenuItem key={b.id_benevole+"-"+b.nom_benevole} value={b.id_benevole}>{b.prenom_benevole+" "+b.nom_benevole}</MenuItem>
          ))}
        </Select>

        <LocalizationProvider adapterLocale={'fr'} dateAdapter={AdapterDayjs}>
        <Stack component="form" noValidate spacing={3}>
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
      <Button
          onClick={handleCreate}>
          Ajouter le créneau
        </Button>
      </>
    )
  }
}
