import { Button, Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Jeu from "../../models/Jeu";
import LoadingPage from "../LoadingPage";
import { Link } from "react-router-dom";
import JeuItem from "./JeuItem";
import '../../styles/App.css';
import '../../styles/Jeu.css';
import ButtonBase from "@mui/material/ButtonBase/ButtonBase";


export default function JeuxList(props: { isAdmin: boolean; }) {
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [jeux, setJeux] = useState<Jeu[]>([]);

  const handleDeleteJeu = (id_jeu: number) => {
    const newList = jeux.filter((item) => item.id_jeu !== id_jeu);
    setJeux(newList);
  }

  const handleModifyJeu = (id_jeu: number) => {
    const newList = jeux.filter((item) => item.id_jeu !== id_jeu);
    setJeux(newList);
  }

  //Lors du chargement de la page, se fait 1 seule fois
  useEffect(() => {
    //On récupère les jeux
    axios.get<Jeu[]>("http://localhost:3333/jeu")
      .then(res => { 
        setIsLoaded(true);
        setJeux(res.data);
      })
      .catch((error : AxiosError) => {
        setIsLoaded(true);
        setError(error);
      })
  }, []);

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
            <Link to="/jeux/add">
              <Button variant="outlined" sx={{textTransform: 'none'}}>
                Ajouter un nouveau jeu
              </Button>
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
        <TableContainer>
          <Table>
            <TableBody>
              {jeux.map((jeu) => (
                <JeuItem isAdmin={props.isAdmin} jeu={jeu} onClickDelete={handleDeleteJeu} onClickModify={handleModifyJeu}></JeuItem>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
}   