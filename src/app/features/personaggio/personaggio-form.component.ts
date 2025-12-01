import { Component, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { PersonaggiService } from '../../services/personaggi.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location, CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { Personaggio, AbilityScores } from '../../models/personaggio';
import { DndApiService, DndClass, DndRace, DndLanguage, DndAlignment } from '../../services/dnd-api.service';

@Component({
  selector: 'app-personaggio-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  template: `
    <div class="form-container">
      <h2>{{ isEditMode ? '✏️ Modifica Personaggio' : '🗡️ Creazione Personaggio D&D 5e' }}</h2>

      @if (loading()) {
        <p class="loading">⏳ Caricamento dati ufficiali D&D 5e...</p>
      }

      @if (!loading()) {
        <form [formGroup]="personaggioForm" (ngSubmit)="onSubmit()">

          <div class="avatar-section">
            <div class="avatar-preview">
              @if (avatarPreview()) {
                <img [src]="avatarPreview()" alt="Avatar" />
              } @else {
                <div class="avatar-placeholder">
                  <span>👤</span>
                  <p>nessun ritratto</p>
                </div>
              }
            </div>
            <div class="avatar-upload">
              <label class="upload-label">
                <input type="file" accept="image/*" (change)="onAvatarSelect($event)" hidden />
                <span>📜 carica ritratto</span>
              </label>
              @if (avatarPreview()) {
                <button type="button" class="btn-remove-avatar" (click)="removeAvatar()">✕ rimuovi</button>
              }
            </div>
          </div>

          <label>
            Nome del Personaggio
            <input type="text" formControlName="nome" placeholder="Es: Thorin Manto di Quercia" />
          </label>
          @if (personaggioForm.controls.nome.invalid && personaggioForm.controls.nome.touched) {
            <p class="error">Il nome è obbligatorio</p>
          }

          <div class="form-row">
            <label>
              Razza Ufficiale D&D
              <select formControlName="razza" (change)="onRaceChange($event)">
                <option value="">-- Seleziona Razza --</option>
                @for (race of races(); track race.index) {
                  <option [value]="race.name">{{race.name}}</option>
                }
              </select>
            </label>
            <label>
              Classe Ufficiale D&D
              <select formControlName="classe" (change)="onClassChange($event)">
                <option value="">-- Seleziona Classe --</option>
                @for (cls of classes(); track cls.index) {
                  <option [value]="cls.name">{{cls.name}}</option>
                }
              </select>
            </label>
          </div>
          @if (personaggioForm.controls.razza.invalid && personaggioForm.controls.razza.touched) {
            <p class="error">La razza è obbligatoria</p>
          }
          @if (personaggioForm.controls.classe.invalid && personaggioForm.controls.classe.touched) {
            <p class="error">La classe è obbligatoria</p>
          }

          <label>
            Livello
            <input type="number" formControlName="livello" min="1" max="20" />
          </label>
          @if (personaggioForm.controls.livello.invalid && personaggioForm.controls.livello.touched) {
            <p class="error">Il livello è obbligatorio (1-20)</p>
          }

          <h3>📊 Punteggi Caratteristica</h3>
          <button type="button" class="btn-roll" (click)="rollAllAbilities()">🎲 Tira tutti i punteggi (4d6 drop lowest)</button>
          
          <div class="abilities-grid">
            @for (ability of abilityNames; track ability) {
              <div class="ability-box">
                <label>{{ability | uppercase}}</label>
                <input type="number" [formControlName]="ability" min="1" max="20" />
                <span class="modifier">{{getModifier(ability)}}</span>
              </div>
            }
          </div>

          <div class="form-row">
            <label>
              Allineamento
              <select formControlName="allineamento">
                <option value="">-- Seleziona --</option>
                @for (align of alignments(); track align.index) {
                  <option [value]="align.name">{{align.name}}</option>
                }
              </select>
            </label>
            <label>
              Background
              <input type="text" formControlName="background" placeholder="Es: Soldato, Saggio..." />
            </label>
          </div>

          <label>
            Linguaggi (separati da virgola)
            <input type="text" formControlName="linguaggi" placeholder="Es: Comune, Elfico, Nanico" />
          </label>

          <label>
            Note / Tratti aggiuntivi
            <textarea formControlName="note" rows="3" placeholder="Tratti, ideali, legami, difetti..."></textarea>
          </label>

          <div class="calculated-stats">
            <div class="stat-card">
              <strong>HP Max</strong>
              <span>{{calculatedHP()}}</span>
            </div>
            <div class="stat-card">
              <strong>Classe Armatura</strong>
              <span>{{calculatedAC()}}</span>
            </div>
            <div class="stat-card">
              <strong>Iniziativa</strong>
              <span>{{calculatedInitiative()}}</span>
            </div>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="goBack()">Annulla</button>
            <button type="submit" [disabled]="personaggioForm.invalid || loading()">{{ isEditMode ? 'Salva Modifiche' : 'Crea Personaggio' }}</button>
          </div>
        </form>
      }
    </div>
  `,
  styleUrls: ['./personaggio-form.component.scss']
})
export class PersonaggioFormComponent implements OnInit {
  personaggioForm;
  campagnaId: number;
  personaggioId: number | null = null;
  isEditMode = false;

  // Signals per dati D&D API
  loading = signal(true);
  classes = signal<DndClass[]>([]);
  races = signal<DndRace[]>([]);
  alignments = signal<DndAlignment[]>([]);
  selectedClass = signal<DndClass | null>(null);
  selectedRace = signal<DndRace | null>(null);
  avatarPreview = signal<string | null>(null);
  avatarBase64 = signal<string | null>(null);

  // Array nomi abilità
  abilityNames = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];

  constructor(
    private fb: FormBuilder,
    private ps: PersonaggiService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private userService: UserService,
    private dndApi: DndApiService
  ) {
    const campagnaIdParam = this.route.snapshot.paramMap.get('campagnaId');
    const personaggioIdParam = this.route.snapshot.paramMap.get('id');
    
    this.campagnaId = campagnaIdParam ? Number(campagnaIdParam) : 0;
    this.personaggioId = personaggioIdParam ? Number(personaggioIdParam) : null;
    this.isEditMode = !!this.personaggioId;
    
    this.personaggioForm = this.fb.group({
      nome: ['', Validators.required],
      classe: ['', Validators.required],
      razza: ['', Validators.required],
      livello: [1, [Validators.required, Validators.min(1)]],
      strength: [10, [Validators.required, Validators.min(1), Validators.max(20)]],
      dexterity: [10, [Validators.required, Validators.min(1), Validators.max(20)]],
      constitution: [10, [Validators.required, Validators.min(1), Validators.max(20)]],
      intelligence: [10, [Validators.required, Validators.min(1), Validators.max(20)]],
      wisdom: [10, [Validators.required, Validators.min(1), Validators.max(20)]],
      charisma: [10, [Validators.required, Validators.min(1), Validators.max(20)]],
      allineamento: [''],
      background: [''],
      linguaggi: ['Comune'],
      note: ['']
    });
  }

  ngOnInit() {
    // Carica dati D&D API
    this.dndApi.getCharacterCreationData().subscribe({
      next: (data) => {
        this.classes.set(data.classes);
        this.races.set(data.races);
        this.alignments.set(data.alignments);
        this.loading.set(false);
        
        // Se in modalità modifica, carica i dati del personaggio
        if (this.isEditMode && this.personaggioId) {
          this.loadPersonaggioData();
        }
      },
      error: (err) => {
        console.error('Errore caricamento dati D&D:', err);
        this.loading.set(false);
      }
    });
  }

  loadPersonaggioData() {
    this.loading.set(true);
    this.ps.getById(this.personaggioId!).subscribe({
      next: (personaggio) => {
        this.campagnaId = personaggio.campagnaId;
        this.personaggioForm.patchValue({
          nome: personaggio.nome,
          classe: personaggio.classe,
          razza: personaggio.razza,
          livello: personaggio.livello,
          strength: personaggio.abilityScores?.strength || 10,
          dexterity: personaggio.abilityScores?.dexterity || 10,
          constitution: personaggio.abilityScores?.constitution || 10,
          intelligence: personaggio.abilityScores?.intelligence || 10,
          wisdom: personaggio.abilityScores?.wisdom || 10,
          charisma: personaggio.abilityScores?.charisma || 10,
          allineamento: personaggio.allineamento || '',
          background: personaggio.background || '',
          linguaggi: Array.isArray(personaggio.linguaggi) ? personaggio.linguaggi.join(', ') : '',
          note: personaggio.note || ''
        });
        
        if (personaggio.avatar) {
          this.avatarPreview.set(personaggio.avatar);
          this.avatarBase64.set(personaggio.avatar);
        }
        
        // Imposta la classe e razza selezionate
        const selectedClass = this.classes().find(c => c.name === personaggio.classe);
        const selectedRace = this.races().find(r => r.name === personaggio.razza);
        if (selectedClass) this.selectedClass.set(selectedClass);
        if (selectedRace) this.selectedRace.set(selectedRace);
        
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Errore caricamento personaggio:', err);
        this.loading.set(false);
      }
    });
  }

  onClassChange(event: Event) {
    const className = (event.target as HTMLSelectElement).value;
    const cls = this.classes().find(c => c.name === className);
    if (cls) {
      this.selectedClass.set(cls);
      this.dndApi.getClassDetails(cls.index).subscribe({
        next: (details) => this.selectedClass.set(details),
        error: (err) => console.error('Errore dettagli classe:', err)
      });
    }
  }

  onRaceChange(event: Event) {
    const raceName = (event.target as HTMLSelectElement).value;
    const race = this.races().find(r => r.name === raceName);
    if (race) {
      this.selectedRace.set(race);
      this.dndApi.getRaceDetails(race.index).subscribe({
        next: (details) => this.selectedRace.set(details),
        error: (err) => console.error('Errore dettagli razza:', err)
      });
    }
  }

  rollAllAbilities() {
    const scores = this.dndApi.generateAbilityScores();
    this.personaggioForm.patchValue(scores);
  }

  getModifier(abilityName: string): string {
    const score = this.personaggioForm.get(abilityName)?.value || 10;
    const mod = this.dndApi.calculateModifier(score);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }

  calculatedHP(): number {
    const cls = this.selectedClass();
    const conMod = this.dndApi.calculateModifier(this.personaggioForm.get('constitution')?.value || 10);
    if (cls) {
      return this.dndApi.calculateInitialHP(cls.hit_die, conMod);
    }
    return 10 + conMod; // Fallback generico
  }

  calculatedAC(): number {
    const dexMod = this.dndApi.calculateModifier(this.personaggioForm.get('dexterity')?.value || 10);
    return 10 + dexMod; // AC base senza armatura
  }

  calculatedInitiative(): number {
    return this.dndApi.calculateModifier(this.personaggioForm.get('dexterity')?.value || 10);
  }

  onAvatarSelect(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      // Preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview.set(e.target?.result as string);
        this.avatarBase64.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  removeAvatar() {
    this.avatarPreview.set(null);
    this.avatarBase64.set(null);
  }

  onSubmit() {
    if (this.personaggioForm.valid) {
      const formValue = this.personaggioForm.value;
      const currentUser = this.userService.currentUser();
      
      const abilityScores: AbilityScores = {
        strength: formValue.strength!,
        dexterity: formValue.dexterity!,
        constitution: formValue.constitution!,
        intelligence: formValue.intelligence!,
        wisdom: formValue.wisdom!,
        charisma: formValue.charisma!
      };

      const personaggioData: Omit<Personaggio, 'id'> = {
        nome: formValue.nome!,
        classe: formValue.classe!,
        razza: formValue.razza!,
        livello: formValue.livello!,
        campagnaId: this.campagnaId,
        userId: currentUser?.id || 0,
        abilityScores,
        puntiFerita: this.calculatedHP(),
        puntiFeritaMax: this.calculatedHP(),
        classeArmatura: this.calculatedAC(),
        iniziativa: this.calculatedInitiative(),
        velocita: this.selectedRace()?.speed || 30,
        linguaggi: formValue.linguaggi?.split(',').map(l => l.trim()) || ['Comune'],
        background: formValue.background || undefined,
        allineamento: formValue.allineamento || undefined,
        esperienza: 0,
        note: formValue.note || undefined,
        avatar: this.avatarBase64() || undefined
      };
      
      if (this.isEditMode && this.personaggioId) {
        // Modalità modifica
        this.ps.updatePersonaggio(this.personaggioId, personaggioData).subscribe({
          next: () => this.router.navigate(['/personaggi', this.campagnaId]),
          error: (err) => console.error('Errore modifica personaggio:', err)
        });
      } else {
        // Modalità creazione
        this.ps.addPersonaggio(personaggioData).subscribe({
          next: () => this.router.navigate(['/personaggi', this.campagnaId]),
          error: (err) => console.error('Errore salvataggio personaggio:', err)
        });
      }
    }
  }

  goBack() {
    this.location.back();
  }
}
