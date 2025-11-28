export interface Personaggio {
  id: number;           // identificatore univoco
  nome: string;         // nome del personaggio
  classe: string;       // classe D&D (es: Guerriero, Mago)
  razza: string;        // razza D&D (es: Elfo, Nano)
  livello: number;      // livello del personaggio
  campagnaId: number;   // id della campagna a cui appartiene
  userId: number;       // id del giocatore proprietario del personaggio
}
