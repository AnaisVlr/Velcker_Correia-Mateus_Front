import {Box, Grid} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import LoadingPage from "../LoadingPage";
import Zone from "../../models/Zone";
import Jeu from "../../models/Jeu";
import '../../styles/Home.css';
import ZoneItem from "./ZoneItem";

export default function ZoneList(props: { isAdmin: boolean; }) {
  const [error, setError] = useState<AxiosError | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [zones, setZones] = useState<Zone[]>([]);
  const [jeux, setJeux] = useState<Jeu[]>([]);
  
  useEffect(() => {
    axios.get<Zone[]>("https://velcker-correia-mateus-api-mobile.cluster-ig3.igpolytech.fr/zone")
      .then(res => { 
        let listZones : Zone[] = res.data
        
        listZones.forEach(zone => {
          axios.get<Jeu[]>("https://velcker-correia-mateus-api-mobile.cluster-ig3.igpolytech.fr/jeu/zone/"+zone.id_zone)
          .then(res => {
            zone.jeux = []
            
            res.data.forEach((ele: any) => {
              zone.jeux.push(ele)
            });
          });
        })

        setZones(listZones)
        setIsLoaded(true);
      })
      .catch((error : AxiosError) => {
        setIsLoaded(true);
        setError(error);
      });

      axios.get<Jeu[]>("https://velcker-correia-mateus-api-mobile.cluster-ig3.igpolytech.fr/jeu")
      .then(res => {
        setJeux(res.data)
        
      })
      .catch((error : AxiosError) => {
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
            {zones.map((zone: Zone) => (
              <Grid key={'zone-'+zone.id_zone} item>
                <ZoneItem isAdmin={props.isAdmin} zone={zone} listJeux={jeux}></ZoneItem>
              </Grid>
            ))}
          </Grid>
        </Box>
      </>
    );
  }
}   