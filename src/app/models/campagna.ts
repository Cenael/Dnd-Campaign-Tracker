export interface Campagna {
  id: number;           // identificatore univoco
  nome: string;         // nome della campagna
  descrizione: string;  // breve descrizione
  gmId: number;         // ID del Game Master
  giocatori: number[];  // array di ID giocatori che hanno aderito
}
