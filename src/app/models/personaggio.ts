export interface AbilityScores {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface Proficiencies {
  armor: string[];
  weapons: string[];
  tools: string[];
  savingThrows: string[];
  skills: string[];
}

export interface Personaggio {
  id?: number;
  nome: string;
  classe: string;
  razza: string;
  livello: number;
  campagnaId: number;
  userId: number;

  abilityScores: AbilityScores;
  puntiFerita: number;
  puntiFeritaMax: number;
  classeArmatura: number;
  iniziativa: number;
  velocita: number;

  proficiencies?: Proficiencies;
  linguaggi?: string[];
  tratti?: string[];

  background?: string;
  allineamento?: string;
  esperienza?: number;

  equipaggiamento?: string[];

  note?: string;

  avatar?: string;
}
