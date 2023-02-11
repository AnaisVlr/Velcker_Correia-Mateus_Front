import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { decodeToken } from 'react-jwt';

import Benevole from "../models/Benevole";
import Zone from "../models/Zone";

import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from "@mui/material/Button";

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/fr';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

function BenevoleComponent() {

  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [benevoles, setBenevoles] = useState<Benevole[]>([]);
  const [filteredBenevoles, setFilteredBenevoles] = useState<Benevole[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  const [selectedZone, setSelectedZone] = useState<string>('');
  const [debut, setDebut] = useState<Dayjs | null>(dayjs('2023-01-01T00:00:00'));
  const [fin, setFin] = useState<Dayjs | null>(dayjs('2023-01-01T00:00:00'));

  const navigate = useNavigate();

  const handleDisconnect = () => {
    localStorage.removeItem("access_token")
    navigate('/');
  }
  const handleChangeZone = (event: SelectChangeEvent) => {
    setSelectedZone(event.target.value);
  };
  const handleChangeDebut = (newValue: Dayjs | null) => {
    setDebut(newValue);
  };
  const handleChangeFin = (newValue: Dayjs | null) => {
    setFin(newValue);
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if(token != null) { // S'il existe
      if(decodeToken(token) == null) //Si token invalide
      navigate('/');
    }
    else navigate('/');


    //Premier chargement
    if(!isLoaded) {
      axios.get<Benevole[]>("http://localhost:3333/benevole")
      .then(res => { 
        setIsLoaded(true);
        setBenevoles(res.data);
      })
      .catch((error : AxiosError) => {
        setIsLoaded(true);
        setError(error);
      })
      axios.get<Zone[]>("http://localhost:3333/zone")
      .then(res => {
        res.data.push(new Zone(-1, "", [], [])) //Pas de zone sélectionnée
        setZones(res.data);
      })
      .catch((error : AxiosError) => {
        setError(error);
      })
    }
    
    if(selectedZone !== "")
      setFilteredBenevoles(benevoles.filter((item) => item.zones.find(e => e.nom_zone === selectedZone)))
    else
      setFilteredBenevoles(benevoles)

    console.log(selectedZone)
    console.log(debut)
    console.log(fin)


    /* if(debut != null)
      setFilteredBenevoles(filteredBenevoles.filter((item) => item.zones.find(e => e.debut >= debut.getDate())))
    if(fin != null)
      setFilteredBenevoles(filteredBenevoles.filter((item) => item.zones.find(e => e.fin <= debut.getDate())))
    */

  }, [debut, fin, selectedZone, benevoles, filteredBenevoles, isLoaded]);

  if (error) {
    return <div>Erreur : {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Chargement...</div>;
  } else {
    return (
      <>
      <Link to="/">Affecter des bénévoles à des zones (Redirection à faire)</Link>
      <Select
        value={selectedZone}
        onChange={handleChangeZone}
        displayEmpty
      >
        <MenuItem value="">Tous</MenuItem>
        {zones.map((i) => (
          <MenuItem key={i.id_zone+"-"+i.nom_zone} value={i.nom_zone}>{i.nom_zone}</MenuItem>
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

      {benevoles.map((benevole) => (
        <div key={benevole.id_benevole+"-"+benevole.nom_benevole}>
          <h3>{benevole.nom_benevole +" "+ benevole.prenom_benevole} (Lors d'un clique, déroulement pour voir les créneaux avec les zones)</h3>
          <button onClick={() => {
            axios.delete("http://localhost:3333/benevole/"+benevole.id_benevole)
            .then(() => {
              const newList = benevoles.filter((item) => item.id_benevole !== benevole.id_benevole);
              setBenevoles(newList);
             })
          }}>Supprimer</button>
        </div>
      ))}
      </>
    );
  }
}
    
export default BenevoleComponent;
    