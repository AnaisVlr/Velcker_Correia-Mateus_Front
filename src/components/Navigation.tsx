import { useEffect, useState } from "react";
import { decodeToken } from "react-jwt";
import BenevoleList from "./benevole/BenevoleList";
import HomePage from "./HomePage";
import JeuComponent from "./jeu/JeuComponent";
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

    if (props.page === "jeu" ){
        return (
            <JeuComponent isAdmin={isAdmin}></JeuComponent>
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
    else{
        return (
            <HomePage></HomePage>
        )
    }
}