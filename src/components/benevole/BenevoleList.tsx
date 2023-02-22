import '../../styles/BenevoleList.css'

import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { decodeToken, isExpired } from 'react-jwt';

import Benevole from "../../models/Benevole";
import Zone from "../../models/Zone";

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
import BenevoleWithCreneaux from "../../models/BenevoleWithCreneaux";
import Creneau from "../../models/Creneau";
import { Checkbox, List, ListItem } from "@mui/material";
import BenevoleListItem from "./BenevoleListItem";

export default function BenevoleList() {

  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  const [benevoles, setBenevoles] = useState<BenevoleWithCreneaux[]>([]);
  const [filteredBenevoles, setFilteredBenevoles] = useState<BenevoleWithCreneaux[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  const [selectedZone, setSelectedZone] = useState<number>(-1);
  const [debut, setDebut] = useState<Dayjs | null>(dayjs('2000-01-01T00:00:00'));
  const [debutActive, setDebutActive] = useState<boolean>(false)
  const [fin, setFin] = useState<Dayjs | null>(dayjs('2030-01-01T00:00:00'));
  const [finActive, setFinActive] = useState<boolean>(false)

  const navigate = useNavigate();

  //Vérifie que la session utilisateur est correcte
  const authentificationValid = () => {
    const token = localStorage.getItem('access_token');
    let stillValid = false
    if(token != null)
      if(decodeToken(token) != null)
        if(!isExpired(token))
          stillValid = true
    if(!stillValid)
      navigate('/')
  };
  //Vérifie que l'utilisateur est admin
  const authenficiationIsAdmin = () => {
    const token = localStorage.getItem('access_token');
    if(token != null) {
      const decoded : {
        email: string,
        exp: number,
        iat: number,
        is_admin: boolean,
        sub: number} | null = decodeToken(token)
      if(decoded  != null)
        setIsAdmin(decoded.is_admin)
        
    }
  };
  const handleDisconnect = () => {
    localStorage.removeItem("access_token")
    navigate('/');
  };
  const handleChangeZone = (event: SelectChangeEvent) => {
    setSelectedZone(Number(event.target.value));
  };
  const handleChangeDebutActive = (event: any) => {
    setDebutActive(event.target.checked)
  };
  const handleChangeDebut = (newValue: Dayjs | null) => {
    setDebut(newValue);
  };
  const handleChangeFinActive = (event: any) => {
    setFinActive(event.target.checked)
  };
  const handleChangeFin = (newValue: Dayjs | null) => {
    setFin(newValue);
  };

  const handleDeleteBenevole = (id_benevole: number) => {
    const newList = benevoles.filter((item) => item.id_benevole !== id_benevole);
    setBenevoles(newList);
  }

  // Une seule fois
  useEffect(() => {
    //Vérifie si l'utilisateur est admin
    authenficiationIsAdmin()
    //Liste des bénévoles et leur créneaux respectifs (vide si pas de créneau)
    const benevoleArray : BenevoleWithCreneaux[] = [];

    //D'abord fetch tous les bénévoles, ensuite on récupérera leur créneau
    axios.get<Benevole[]>("http://localhost:3333/benevole")
    .then(res => {
      res.data.forEach((d: any) => {
        benevoleArray.push(new BenevoleWithCreneaux(d.id_benevole, d.prenom_benevole, d.nom_benevole, d.email_benevole, "", d.is_admin, []))
      });
      //Récupération des créneaux
      axios.get("http://localhost:3333/benevole/creneaux")
      .then(res => {
        res.data.forEach((d: any) => {   
          const benevole : Benevole = new Benevole(d.benevole.id_benevole, d.benevole.prenom_benevole, d.benevole.nom_benevole, d.benevole.email_benevole, "", [d.zone])
          const b = benevoleArray.find(b => b.id_benevole === d.id_benevole)
          b?.creneaux.push(new Creneau(benevole, d.zone, d.debut, d.fin))
        });
        
        setIsLoaded(true);
        setBenevoles(benevoleArray);
        setFilteredBenevoles(benevoleArray)
      })
      .catch((error : AxiosError) => {
        setIsLoaded(true);
        setError(error);
      })
    })
    .catch((error : AxiosError) => {
      setError(error);
    });
    
    //Récupérer la liste des zones
    axios.get<Zone[]>("http://localhost:3333/zone")
    .then(res => {
      res.data.push(new Zone(-1, "Tous", [], [])) //Pas de zone sélectionnée
      res.data.sort((a, b) => a.id_zone - b.id_zone)
      setZones(res.data);
    })
    .catch((error : AxiosError) => {
      setError(error);
    })
  }, []);

  // Quand on modifie les poaramètres de tri
  useEffect(() => {
    authentificationValid()

    let liste : BenevoleWithCreneaux[] = benevoles;

    if(selectedZone !== -1)
      liste = liste.filter((item) => item.creneaux.find(e => e.zone.id_zone === selectedZone))

    if(debut != null && debutActive && fin != null && finActive)
      liste = liste.filter((item) => item.creneaux.find(c => dayjs(c.debut).isAfter(debut) && dayjs(c.fin).isBefore(fin)))
    else if(debut != null && debutActive)
      liste = liste.filter((item) => item.creneaux.find(c => dayjs(c.debut).isAfter(debut)))
    else if(fin != null && finActive)
      liste = liste.filter((item) => item.creneaux.find(c => dayjs(c.fin).isBefore(fin)))
    
      setFilteredBenevoles(liste)

  }, [benevoles, debut, debutActive, fin, finActive, selectedZone]);

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
        {isAdmin &&
          <>
            <Link to="addBenevole/">Créer des comptes bénévoles (ADMIN)</Link>
            <Link to="addCreneau/">Affecter des bénévoles à des zones (ADMIN)</Link>
          </>
        }

        <Stack direction="row" spacing={3}>
          <p>Zone : </p>
          <Select
            value={String(selectedZone)}
            onChange={handleChangeZone}
          >
            {zones.map((i) => (
              <MenuItem key={i.id_zone+"-"+i.nom_zone} value={i.id_zone}>{i.nom_zone}</MenuItem>
            ))}
          </Select>

          <LocalizationProvider adapterLocale={'fr'} dateAdapter={AdapterDayjs}>
            <Checkbox
              checked={debutActive}
              onChange={handleChangeDebutActive}
            />
            <DateTimePicker
              disabled={!debutActive}
              label="Début"
              value={debut}
              onChange={handleChangeDebut}
              renderInput={(params) => <TextField {...params} />}
            />
            <Checkbox
              checked={finActive}
              onChange={handleChangeFinActive}
            />
            <DateTimePicker
              disabled={!finActive}
              label="Fin"
              value={fin}
              onChange={handleChangeFin}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

        </Stack>

        <List className="benevoleList">
          {filteredBenevoles.map((benevole) => (
            <ListItem className='benevoleListItem'>
              <BenevoleListItem isConnectedUserAdmin={isAdmin} onClickDelete={handleDeleteBenevole} benevole={benevole} key={benevole.id_benevole+"-"+benevole.nom_benevole}/>
            </ListItem>
          ))}
        </List>
      </>
    );
  }
}
    