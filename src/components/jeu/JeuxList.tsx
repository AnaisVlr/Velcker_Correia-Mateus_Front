import { Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Jeu from "../../models/Jeu";
import Zone from "../../models/Zone";
import LoadingPage from "../LoadingPage";
import { Link } from "react-router-dom";
import JeuItem from "./JeuItem";
import '../../styles/App.css';
import '../../styles/Jeu.css';


export default function JeuxList(props: { isAdmin: boolean; }) {
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [jeux, setJeux] = useState<Jeu[]>([]);
  const [filteredJeux, setFilteredJeux] = useState<Jeu[]>([])
  const [zones, setZones] = useState<Zone[]>([]);

  const [selectedZone, setSelectedZone] = useState<number>(-1);

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
            jeu.zones = res.data
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

    console.log(selectedZone);
    
    if(selectedZone !== -1)
      liste = liste.filter((item) => item.zones.find(e => e.id_zone === selectedZone))
      

    setFilteredJeux(liste)
  }, [selectedZone])

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
          <>
            <Link to="/jeux/add" className="boutonAjout">
              Ajouter un nouveau jeu
            </Link>
          </>
          }
        </div>

        {/* <FormControl sx={{ m: 1, width: 300 }}>
          <InputLabel>
            Chip
          </InputLabel>
          <Select
            multiple
            value={selectedZone}
            onChange={handleChange}
            input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
            renderValue={(selected) => (
              <Box>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {zones.map((zone) => (
              <MenuItem
                key={zone.id_zone}
                value={zone.nom_zone}
              >
                {zone.nom_zone}
              </MenuItem>
            ))}
          </Select>
        </FormControl> */}
        <p>Zone : </p>
          <Select
            value={String(selectedZone)}
            onChange={(event: SelectChangeEvent) => { setSelectedZone(Number(event.target.value)); }}
            >
            {zones.map((i) => (
              <MenuItem key={i.id_zone+"-"+i.nom_zone} value={i.id_zone}>{i.nom_zone}</MenuItem>
              ))}
          </Select>
        <TableContainer>
          <Table>
            <TableBody>
              {filteredJeux.map((jeu) => (
                <JeuItem key={"jeuitem-"+jeu.id_jeu} isAdmin={props.isAdmin} jeu={jeu} onClickDelete={handleDeleteJeu}></JeuItem>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
}   