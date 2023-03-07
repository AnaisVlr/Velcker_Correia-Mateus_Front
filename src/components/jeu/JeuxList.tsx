import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Jeu from "../../models/Jeu";
import Zone from "../../models/Zone";
import LoadingPage from "../LoadingPage";
import { Link } from "react-router-dom";
import JeuItem from "./JeuItem";
import '../../styles/App.css';
import '../../styles/Jeu.css';

import { Button, Table, TableBody, TableContainer } from "@mui/material";
import { SelectChangeEvent } from '@mui/material/Select';
import { TextField, MenuItem, Select, Stack, Box } from "@mui/material";


export default function JeuxList(props: { isAdmin: boolean; }) {
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [jeux, setJeux] = useState<Jeu[]>([]);
  const [filteredJeux, setFilteredJeux] = useState<Jeu[]>([])
  const [zones, setZones] = useState<Zone[]>([]);

  const [selectedZone, setSelectedZone] = useState<number>(-1);
  const [selectedType, setSelectedType] = useState<string>("TOUS");
  const [selectedName, setSelectedName] = useState<string>("");

  const handleDeleteJeu = (id_jeu: number) => {
    const newList = jeux.filter((item) => item.id_jeu !== id_jeu);
    setJeux(newList);
  }

  //Lors du chargement de la page, se fait 1 seule fois
  useEffect(() => {
    //On récupère les jeux
    axios.get<Jeu[]>("http://localhost:3333/jeu")
      .then(res => {
        setIsLoaded(true);

        let listJeux : Jeu[] = res.data
        
        listJeux.forEach(jeu => {
          axios.get<Zone[]>("http://localhost:3333/zone/"+jeu.id_jeu+"/jeu")
          .then(res => {
            jeu.zones = []
            res.data.forEach((ele: any) => {
              jeu.zones.push(ele.zone)
            })
          });
        })
        setJeux(listJeux)
        setFilteredJeux(listJeux);
      })
      .catch((error : AxiosError) => {
        setIsLoaded(true);
        setError(error);
      })

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

  useEffect(() => {
    
    let liste : Jeu[] = jeux;
    
    if(selectedZone !== -1)
      liste = liste.filter((item) => item.zones.find(e => e.id_zone === selectedZone))

    if(selectedType !== "TOUS")
      liste = liste.filter((item) => item.type_jeu === selectedType)
    
    if(selectedName.length > 0)
      liste = liste.filter((item) => item.nom_jeu.toLowerCase().includes(selectedName.toLowerCase()))

    setFilteredJeux(liste)
  }, [selectedZone, selectedType, selectedName, jeux])

  if (error) {
    return <div>Erreur : {error.message}</div>;
  } else if (!isLoaded) {
    return <LoadingPage></LoadingPage>
  } else {
    return (
      <>
        <p>Liste des jeux présents au festival FJM</p>

        <div>
          {props.isAdmin &&
          <Box sx={{m:1}}>
            <Link to="/jeux/add">
              <Button variant="contained" sx={{textTransform:'none'}}>
                Ajouter un nouveau jeu
              </Button>
            </Link>
          </Box>
          }
        </div>
        <Stack direction="row" spacing={5} sx={{alignItems:"center"}}>
          <TextField
            label="Recherche par nom..."
            color="primary"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {setSelectedName(event.target.value);}}
          />
          <p>Par zone : </p>
          <Select
            value={String(selectedZone)}
            onChange={(event: SelectChangeEvent) => { setSelectedZone(Number(event.target.value)); }}
            >
            {zones.map((i) => (
              <MenuItem key={i.id_zone+"-"+i.nom_zone} value={i.id_zone}>{i.nom_zone}</MenuItem>
              ))}
          </Select>
          <p>Par type : </p>
          <Select
            value={selectedType}
            onChange={(event: SelectChangeEvent) => { setSelectedType(event.target.value) }}
          >
            <MenuItem value="TOUS">Tous</MenuItem>
            <MenuItem value="AMBIANCE">Ambiance</MenuItem>
            <MenuItem value="ENFANT">Enfant</MenuItem>
            <MenuItem value="EXPERT">Expert</MenuItem>
            <MenuItem value="FAMILLE">Famille</MenuItem>
            <MenuItem value="INITIE">Inité</MenuItem>
          </Select>
        </Stack>

        <TableContainer>
          <Table>
            <TableBody>
              {filteredJeux.map((jeu) => (
                <JeuItem key={"jeuitem-"+jeu.id_jeu} isAdmin={props.isAdmin} jeu={jeu} listZone={zones} onClickDelete={handleDeleteJeu}></JeuItem>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
}   