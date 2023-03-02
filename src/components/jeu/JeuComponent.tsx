import { Box, Chip, Divider, FormControl, InputLabel, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useEffect, useMemo, useState } from "react";
import Jeu from "../../models/Jeu";
import Zone from "../../models/Zone";
import LoadingPage from "../LoadingPage";
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Link } from "react-router-dom";
import React from "react";


export default function JeuComponent(props: { isAdmin: boolean; }) {
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const [jeux, setJeux] = useState<Jeu[]>([]);

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
                <TableRow
                  key={jeu.id_jeu}
                >
                  <TableCell component="th" scope="row">
                    {jeu.nom_jeu}
                  </TableCell>
                  <TableCell align="right">
                    <Link to="/">
                      <VisibilityIcon/>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </>
    );
  }
}   