import Benevole from "./Benevole";
import Jeu from "./Jeu";

export default class Zone{
    id_zone : number;
    nom_zone : string;
    jeux : Jeu[];
    benevoles : Benevole[];

    constructor(id_zone : number, nom_zone : string, jeux : Jeu[], benevoles : Benevole[]){
        this.id_zone = id_zone;
        this.nom_zone = nom_zone;
        this.jeux = jeux;
        this.benevoles = benevoles;
    }
}