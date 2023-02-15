import Zone from "./Zone";
import Benevole from "./Benevole";

export default class Creneau{
    benevole : Benevole;
    zone : Zone;
    debut : Date;
    fin : Date;

    constructor( benevole : Benevole, zone : Zone, debut : Date, fin : Date){
        this.benevole = benevole;
        this.zone = zone;
        this.debut = debut;
        this.fin = fin;
    }
}