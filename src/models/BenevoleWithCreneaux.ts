import Creneau from "./Creneau";

export default class BenevoleWithCreneaux{
  id_benevole : number;
  prenom_benevole : string;
  nom_benevole : string;
  email_benevole : string;
  password_benevole : string;
  creneaux : Creneau[];

  constructor(id_benevole : number, prenom_benevole : string, nom_benevole : string, email_benevole : string, password_benevole : string, creneaux : Creneau[]){
      this.id_benevole = id_benevole;
      this.prenom_benevole = prenom_benevole;
      this.nom_benevole = nom_benevole;
      this.email_benevole = email_benevole;
      this.password_benevole = password_benevole;
      this.creneaux = creneaux;
  }
}