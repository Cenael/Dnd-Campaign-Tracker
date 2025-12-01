import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: '',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'login',
    renderMode: RenderMode.Prerender
  },
  {
    path: 'profilo',
    renderMode: RenderMode.Client
  },
  {
    path: 'campagne',
    renderMode: RenderMode.Client
  },
  {
    path: 'nuova',
    renderMode: RenderMode.Client
  },
  {
    path: 'campagna/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'personaggi/:campagnaId',
    renderMode: RenderMode.Client
  },
  {
    path: 'personaggi/nuovo/:campagnaId',
    renderMode: RenderMode.Client
  },
  {
    path: 'personaggi/modifica/:id',
    renderMode: RenderMode.Client
  },
  {
    path: 'aggiornamenti/:campagnaId',
    renderMode: RenderMode.Client
  },
  {
    path: 'aggiornamenti/nuovo/:campagnaId',
    renderMode: RenderMode.Client
  },
  {
    path: '**',
    renderMode: RenderMode.Client
  }
];
