// Statistiche base D&D
export interface AbilityScores {
  strength: number;      // Forza
  dexterity: number;     // Destrezza
  constitution: number;  // Costituzione
  intelligence: number;  // Intelligenza
  wisdom: number;        // Saggezza
  charisma: number;      // Carisma
}

// Proficienze
export interface Proficiencies {
  armor: string[];       // Armature
  weapons: string[];     // Armi
  tools: string[];       // Strumenti
  savingThrows: string[]; // Tiri salvezza
  skills: string[];      // Abilità
}

// Personaggio completo D&D 5e
export interface Personaggio {
  id?: number;           // identificatore univoco
  nome: string;          // nome del personaggio
  classe: string;        // classe D&D (es: Barbarian, Wizard)
  razza: string;         // razza D&D (es: Elf, Dwarf)
  livello: number;       // livello del personaggio (1-20)
  campagnaId: number;    // id della campagna a cui appartiene
  userId: number;        // id del giocatore proprietario
  
  // Statistiche D&D 5e
  abilityScores: AbilityScores;  // Punteggi caratteristiche
  puntiFerita: number;           // HP attuali
  puntiFeritaMax: number;        // HP massimi
  classeArmatura: number;        // AC (Armor Class)
  iniziativa: number;            // Bonus iniziativa
  velocita: number;              // Velocità movimento (feet)
  
  // Proficienze e tratti
  proficiencies?: Proficiencies; // Competenze
  linguaggi?: string[];          // Lingue conosciute
  tratti?: string[];             // Tratti razziali
  
  // Info aggiuntive
  background?: string;           // Background
  allineamento?: string;         // Allineamento
  esperienza?: number;           // Punti esperienza
  
  // Equipaggiamento
  equipaggiamento?: string[];    // Lista equipaggiamento
  
  // Note
  note?: string;                 // Note libere
  
  // Avatar
  avatar?: string;               // URL o base64 dell'immagine avatar
}
