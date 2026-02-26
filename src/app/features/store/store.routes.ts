import { Routes } from '@angular/router';

export const STORE_ROUTES: Routes = [
  {
    path: 'articles',
    loadComponent: () => import('./pages/store-articles.page').then((m) => m.default),
  },
  { path: '', pathMatch: 'full', redirectTo: 'articles' },
];
