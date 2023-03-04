import { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import Jeu from "../models/Jeu";
import AddBenevole from "./benevole/AddBenevole";
import AddCreneau from "./benevole/AddCreneau";
import BenevoleList from "./benevole/BenevoleList";
import HomePage from "./HomePage";
import AddJeu from "./jeu/AddJeu";
import JeuItem from "./jeu/JeuItem";
import JeuxList from "./jeu/JeuxList";
import Profil from "./Profil";
import ZoneList from "./zone/ZoneList";

export default function Navigation(props: { page: String; }){
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    //Vérifie que l'utilisateur est admin
    const authenficiationIsAdmin = () => {
        const token = localStorage.getItem('access_token');
        if(token != null) {
        const decoded : {
            email: string,
            exp: number,
            iat: number,
            is_admin: boolean,
            sub: number} | null = decodeToken(token)
        if(decoded  != null)
            setIsAdmin(decoded.is_admin)
        }
    };

    useEffect(() => {
        //Vérifie si l'utilisateur est admin
        authenficiationIsAdmin()
    },[])

    if (props.page === "jeux" ){
        return (
            <JeuxList isAdmin={isAdmin}></JeuxList>
        )
    } 
    else if (props.page === "benevole"){
        return (
            <BenevoleList isAdmin={isAdmin}></BenevoleList>
        )
    }
    else if (props.page === "zone"){
        return (
            <ZoneList isAdmin={isAdmin}></ZoneList>
        )
    }
    else if (props.page === "profil"){
        return (
            <Profil></Profil>
        )
    }
    else if (props.page === "addBenevole"){
        return (
            <AddBenevole></AddBenevole>
        )
    }
    else if (props.page === "addCreneau"){
        return (
            <AddCreneau></AddCreneau>
        )
    }
    else if (props.page === "addJeu"){
        return (
            <AddJeu></AddJeu>
        )
    }
    else{
        return (
            <HomePage></HomePage>
        )
    }
}