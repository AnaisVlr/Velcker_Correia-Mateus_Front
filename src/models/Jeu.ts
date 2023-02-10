import { Type } from "./Type";
import Zone from "./Zone";

export default class Jeu{
    id_jeu : number;
    nom_jeu : string;
    type_jeu : Type;
    zones : Zone[];

    constructor(id_jeu : number, nom_jeu : string, type_jeu : Type, zones : Zone[]){
        this.id_jeu = id_jeu;
        this.nom_jeu = nom_jeu;
        this.type_jeu = type_jeu;
        this.zones = zones;
    }
}