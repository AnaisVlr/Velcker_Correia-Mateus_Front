import React from 'react'
import axios, { AxiosError } from "axios";
import Creneau from '../../models/Creneau'
import { Modal, Typography } from '@mui/material';
import { Box } from '@mui/system';

interface typeProps {
  creneau: Creneau,
  isConnectedUserAdmin: boolean,
  onClickDelete: (id_zone: number, debut: Date) => void
}

export default function CreneauListItem(props: typeProps) {
  const c : Creneau = props.creneau

  const [open, setOpen] = React.useState(false);
  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const onClickUpdate = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const onClickDelete = () => {
    /*axios.delete("http://localhost:3333/benevole/"+b.id_benevole)
    .then(() => {
      props.onClickDelete(c.zone.id_zone, c.debut)
    })*/
  }
//<h5> De {c.debut.} à {c.fin.toISOString}</h5>
  return (
    <div>
      <div>
        <h5>Zone affectée : {c.zone.nom_zone}</h5>
        
      </div>
      <>
        {props.isConnectedUserAdmin &&
        <>
          <button onClick={() => onClickUpdate()}>Modifier</button>
          <button onClick={() => onClickDelete()}>Supprimer</button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                FOrmulaire pour modifier les dates
              </Typography>
              <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
              </Typography>
            </Box>
          </Modal>
        </>
        }
      </>
    </div>
  )
}
