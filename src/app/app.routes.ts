import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { ProfiloComponent } from './features/profilo/profilo.component';
import { CampagnaListComponent } from './features/campagna/campagna-list.component';
import { CampagnaFormComponent } from './features/campagna/campagna-form.component';
import { CampagnaDetailComponent } from './features/campagna/campagna-detail.component';
import { PersonaggioListComponent } from './features/personaggio/personaggio-list.component';
import { PersonaggioFormComponent } from './features/personaggio/personaggio-form.component';
import { AggiornamentoListComponent } from './features/aggiornamento/aggiornamento-list.component';
import { AggiornamentoFormComponent } from './features/aggiornamento/aggiornamento-form.component';
import { LoginComponent } from './features/login/login.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', component: HomeComponent },
  { path: 'profilo', component: ProfiloComponent },
  { path: 'campagne', component: CampagnaListComponent },
  { path: 'nuova', component: CampagnaFormComponent },
  { path: 'campagna/:id', component: CampagnaDetailComponent },
  { path: 'personaggi/:campagnaId', component: PersonaggioListComponent },
  { path: 'personaggi/nuovo/:campagnaId', component: PersonaggioFormComponent },
  { path: 'aggiornamenti/:campagnaId', component: AggiornamentoListComponent },
  { path: 'aggiornamenti/nuovo/:campagnaId', component: AggiornamentoFormComponent },
  { path: '**', redirectTo: '' } // fallback
];
 