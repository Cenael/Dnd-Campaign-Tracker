import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

export interface DndClass {
  index: string;
  name: string;
  hit_die: number;
  proficiencies: any[];
  proficiency_choices: any[];
  saving_throws: any[];
  starting_equipment: any[];
  class_levels: string;
  spellcasting?: any;
}

export interface DndRace {
  index: string;
  name: string;
  speed: number;
  ability_bonuses: Array<{
    ability_score: { name: string; index: string };
    bonus: number;
  }>;
  alignment: string;
  age: string;
  size: string;
  size_description: string;
  languages: any[];
  language_desc: string;
  traits: any[];
}

export interface DndSkill {
  index: string;
  name: string;
  desc: string[];
  ability_score: {
    index: string;
    name: string;
  };
}

export interface DndAbilityScore {
  index: string;
  name: string;
  full_name: string;
  desc: string[];
  skills: any[];
}

export interface DndEquipment {
  index: string;
  name: string;
  equipment_category: {
    index: string;
    name: string;
  };
  cost?: {
    quantity: number;
    unit: string;
  };
  weight?: number;
}

export interface DndLanguage {
  index: string;
  name: string;
  type: string;
  typical_speakers: string[];
}

export interface DndAlignment {
  index: string;
  name: string;
  abbreviation: string;
  desc: string;
}

@Injectable({
  providedIn: 'root',
})
export class DndApiService {
  private readonly API_BASE = 'https://www.dnd5eapi.co/api';

  constructor(private http: HttpClient) {}

  getClasses(): Observable<DndClass[]> {
    return this.http.get<{ count: number; results: any[] }>(`${this.API_BASE}/classes`).pipe(
      map((response) => response.results),
      map((classes) => classes.map((c) => ({ ...c, index: c.index, name: c.name })))
    );
  }

  getClassDetails(classIndex: string): Observable<DndClass> {
    return this.http.get<DndClass>(`${this.API_BASE}/classes/${classIndex}`);
  }

  getRaces(): Observable<DndRace[]> {
    return this.http
      .get<{ count: number; results: any[] }>(`${this.API_BASE}/races`)
      .pipe(map((response) => response.results));
  }

  getRaceDetails(raceIndex: string): Observable<DndRace> {
    return this.http.get<DndRace>(`${this.API_BASE}/races/${raceIndex}`);
  }

  getSkills(): Observable<DndSkill[]> {
    return this.http
      .get<{ count: number; results: any[] }>(`${this.API_BASE}/skills`)
      .pipe(map((response) => response.results));
  }

  getAbilityScores(): Observable<DndAbilityScore[]> {
    return this.http
      .get<{ count: number; results: any[] }>(`${this.API_BASE}/ability-scores`)
      .pipe(map((response) => response.results));
  }

  getStartingEquipment(): Observable<DndEquipment[]> {
    return this.http
      .get<{ count: number; results: any[] }>(`${this.API_BASE}/equipment`)
      .pipe(map((response) => response.results.slice(0, 50)));
  }

  getLanguages(): Observable<DndLanguage[]> {
    return this.http
      .get<{ count: number; results: any[] }>(`${this.API_BASE}/languages`)
      .pipe(map((response) => response.results));
  }

  getAlignments(): Observable<DndAlignment[]> {
    return this.http
      .get<{ count: number; results: any[] }>(`${this.API_BASE}/alignments`)
      .pipe(map((response) => response.results));
  }

  getCharacterCreationData(): Observable<{
    classes: DndClass[];
    races: DndRace[];
    skills: DndSkill[];
    languages: DndLanguage[];
    alignments: DndAlignment[];
  }> {
    return forkJoin({
      classes: this.getClasses(),
      races: this.getRaces(),
      skills: this.getSkills(),
      languages: this.getLanguages(),
      alignments: this.getAlignments(),
    });
  }

  calculateModifier(score: number): number {
    return Math.floor((score - 10) / 2);
  }

  rollAbilityScore(): number {
    const rolls = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
    rolls.sort((a, b) => a - b);
    rolls.shift();
    return rolls.reduce((sum, val) => sum + val, 0);
  }

  generateAbilityScores(): { [key: string]: number } {
    return {
      strength: this.rollAbilityScore(),
      dexterity: this.rollAbilityScore(),
      constitution: this.rollAbilityScore(),
      intelligence: this.rollAbilityScore(),
      wisdom: this.rollAbilityScore(),
      charisma: this.rollAbilityScore(),
    };
  }

  calculateInitialHP(hitDie: number, constitutionModifier: number): number {
    return hitDie + constitutionModifier;
  }
}
