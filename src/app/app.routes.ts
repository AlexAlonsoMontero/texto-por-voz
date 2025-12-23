import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'write',
    loadComponent: () => import('./pages/write/write.page').then((m) => m.WritePage),
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.page').then((m) => m.SettingsPage),
  },
  {
    path: 'phrases',
    loadComponent: () => import('./pages/phrases/phrases.page').then((m) => m.PhrasesPage),
  },
  {
    path: '',
    redirectTo: 'write',
    pathMatch: 'full',
  },
];
