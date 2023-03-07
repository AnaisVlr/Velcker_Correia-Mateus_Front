import '../../styles/BenevoleList.css'
import '../../styles/App.css';

import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';

import Benevole from "../../models/Benevole";
import Zone from "../../models/Zone";

import { SelectChangeEvent } from '@mui/material/Select';
import { Checkbox, List, ListItem, TextField, Stack, MenuItem, Select, Container, Button } from "@mui/material";

import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/fr';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import BenevoleWithCreneaux from "../../models/BenevoleWithCreneaux";
import Creneau from "../../models/Creneau";
import BenevoleListItem from "./BenevoleListItem";
import LoadingPage from "../LoadingPage";

export default function BenevoleList(props: { isAdmin: boolean; }) {
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [benevoles, setBenevoles] = useState<BenevoleWithCreneaux[]>([]);
  const [filteredBenevoles, setFilteredBenevoles] = useState<BenevoleWithCreneaux[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);

  const [selectedZone, setSelectedZone] = useState<number>(-1);
  const [debut, setDebut] = useState<Dayjs | null>(dayjs('2000-01-01T00:00:00'));
  const [debutActive, setDebutActive] = useState<boolean>(false)
  const [fin, setFin] = useState<Dayjs | null>(dayjs('2030-01-01T00:00:00'));
  const [finActive, setFinActive] = useState<boolean>(false)

  const handleDeleteBenevole = (id_benevole: number) => {
    const newList = benevoles.filter((item) => item.id_benevole !== id_benevole);
    setBenevoles(newList);
  }

  // Une seule fois
  useEffect(() => {
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
    return <LoadingPage></LoadingPage>
  } else {
    return (
      <>
        {props.isAdmin &&
        <>
          <Link to="addBenevole/"><Button className='bouton'>Créer des comptes bénévoles</Button></Link>
          <Link to="addCreneau/"><Button className='bouton'>Affecter des bénévoles à des zones</Button></Link>
        </>
        }
        <Container>
          <Stack direction="row" spacing={3}>
            <p>Zone : </p>
            <Select
              value={String(selectedZone)}
              onChange={(event: SelectChangeEvent) => { setSelectedZone(Number(event.target.value)); }}
              >
              {zones.map((i) => (
                <MenuItem key={i.id_zone+"-"+i.nom_zone} value={i.id_zone}>{i.nom_zone}</MenuItem>
                ))}
            </Select>

            <LocalizationProvider adapterLocale={'fr'} dateAdapter={AdapterDayjs}>
              <Checkbox
                checked={debutActive}
                onChange={(event: any) => { setDebutActive(event.target.checked); }}
                />
              <DateTimePicker
                disabled={!debutActive}
                label="Début"
                value={debut}
                onChange={(newValue: Dayjs | null) => { setDebut(newValue); }}
                renderInput={(params) => <TextField {...params} />}
                />
              <Checkbox
                checked={finActive}
                onChange={(event: any) => { setFinActive(event.target.checked) }}
                />
              <DateTimePicker
                disabled={!finActive}
                label="Fin"
                value={fin}
                onChange={(newValue: Dayjs | null) => { setFin(newValue); }}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </Stack>
        </Container>

        <List className="benevoleList">
          {filteredBenevoles.map((benevole) => (
            <ListItem key={'listitem-'+benevole.id_benevole} className='benevoleListItem'>
              <BenevoleListItem isConnectedUserAdmin={props.isAdmin} onClickDelete={handleDeleteBenevole} benevole={benevole} key={benevole.id_benevole+"-"+benevole.nom_benevole}/>
            </ListItem>
          ))}
        </List>
      </>
    );
  }
}