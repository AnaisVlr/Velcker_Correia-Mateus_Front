import React from 'react'
import { useNavigate } from 'react-router-dom';
import { decodeToken } from 'react-jwt';
import Button from "@mui/material/Button";

export default function HeaderComponent() {
  let isConnected = false
  const token = localStorage.getItem('access_token');
    if(token != null)
      if(decodeToken(token) != null) //Si token valide
        isConnected = true

  const handleDisconnect = () => {
    localStorage.removeItem("access_token")
    navigate('/');
  }

  const navigate = useNavigate();

  if(isConnected)
    return (
      <Button
        color="secondary"
        onClick={handleDisconnect}>
        Déconnexion
      </Button>
    )
  else
    return (<></>)
}
