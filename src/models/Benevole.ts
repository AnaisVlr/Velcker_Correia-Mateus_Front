import Zone from "./Zone";

export default class Benevole{
    id_benevole : number;
    prenom_benevole : string;
    nom_benevole : string;
    email_benevole : string;
    password_benevole : string;
    zones : Zone[];

    constructor(id_benevole : number, prenom_benevole : string, nom_benevole : string, email_benevole : string, password_benevole : string, zones : Zone[]){
        this.id_benevole = id_benevole;
        this.prenom_benevole = prenom_benevole;
        this.nom_benevole = nom_benevole;
        this.email_benevole = email_benevole;
        this.password_benevole = password_benevole;
        this.zones = zones;
    }
}