import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import Jeu from "../models/Jeu";

function JeuComponent() {
    const [error, setError] = useState<AxiosError | null>(null);
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    const [jeux, setJeux] = useState<Jeu[]>([]);
  
    
    useEffect(() => {
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
        return <div>Chargement...</div>;
      } else {
        return (
            <>
            <p>Coucou test1 réussi ouiii</p>
            {jeux.map((jeu) => (
                <div>
                    <h2>Nom du jeu : {jeu.nom_jeu}</h2>
                </div>
            ))}
            </>
        );
      }
    }
    
export default JeuComponent;
    