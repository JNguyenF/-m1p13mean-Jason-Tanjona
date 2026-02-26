import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: 'boutiques',
    loadComponent: () => import('./pages/admin-boutiques.page').then((m) => m.default),
  },
  { path: '', pathMatch: 'full', redirectTo: 'boutiques' },
];
