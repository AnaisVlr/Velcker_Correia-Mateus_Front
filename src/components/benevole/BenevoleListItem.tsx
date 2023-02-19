import React from 'react'
import axios from "axios";
import BenevoleWithCreneaux from '../../models/BenevoleWithCreneaux';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CreneauListItem from './CreneauListItem';
import Creneau from '../../models/Creneau';

interface typeProps {
  benevole: BenevoleWithCreneaux,
  isConnectedUserAdmin: boolean,
  onClickDelete: (id: number) => void
}

export default function BenevoleListItem(props: typeProps) {
  const b : BenevoleWithCreneaux = props.benevole;

  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [creneaux, setCreneaux] = React.useState<Creneau[]>(b.creneaux);
  const handleChange= () => {
    setExpanded(!expanded);
  }
  const onClickDelete = () => {
    axios.delete("http://localhost:3333/benevole/"+b.id_benevole)
    .then(() => {
      props.onClickDelete(b.id_benevole)
    })
  }
  const handleDeleteCreneau = (id_zone: number, debut: Date) => {
    const newList = creneaux.filter((item) => item.zone.id_zone !== id_zone && new Date(item.debut).getTime() !== debut.getTime());
    setCreneaux(newList);
  }

  return (
    <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
            {b.nom_benevole +" "+ b.prenom_benevole}
            {props.isConnectedUserAdmin &&
              <button onClick={() => onClickDelete()}>Supprimer</button>
            }
        </AccordionSummary>
        <AccordionDetails>
            {creneaux.length === 0 &&
              <p>Aucunes zones affectées </p>
            }
            {creneaux.map((creneau) => (
              <CreneauListItem creneau={creneau} isConnectedUserAdmin={props.isConnectedUserAdmin} onClickDelete={handleDeleteCreneau} key={b.id_benevole+"-"+creneau.zone.id_zone+"-"+creneau.debut}/>
            ))}
        </AccordionDetails>
      </Accordion>
  )
}
