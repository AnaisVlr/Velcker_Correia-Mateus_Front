import {Box, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import LoadingPage from "../LoadingPage";
import Zone from "../../models/Zone";
import '../../styles/Home.css';

export default function ZoneList(props: { isAdmin: boolean; }) {
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [zones, setZones] = useState<Zone[]>([]);
  
  useEffect(() => {
    axios.get<Zone[]>("http://localhost:3333/zone")
      .then(res => { 
        setIsLoaded(true);
        setZones(res.data);
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
        <p>Liste des zones du festival FJM</p>
        <Box sx={{ width: '100%' }}>
            <Grid container spacing={2} justify-content="space-evenly">
                {zones.map((zone) => (
                    <Grid item>
                        <Paper variant="outlined" sx={{ width: 200, height: 200}}>
                            <div className="zoneName">
                                {zone.nom_zone}
                            </div>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
      </>
    );
  }
}   