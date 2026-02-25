import { Routes } from '@angular/router';

import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { role: 'ADMIN' },
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.ADMIN_ROUTES),
  },
  {
    path: 'store',
    canActivate: [authGuard, roleGuard],
    data: { role: 'STORE' },
    loadChildren: () => import('./features/store/store.routes').then((m) => m.STORE_ROUTES),
  },
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'products/all',
  },
  {
    path: 'products/:category',
    loadComponent: () => import('./pages/products-grid/products-grid').then(m => m.default),
  },
  {
    path: 'cart',
    loadComponent: () => import('./pages/cart/cart.page').then(m => m.default),
  },
  {
    path: 'favoris',
    loadComponent: () => import('./pages/my-wishlist/my-wishlist').then(m => m.default),
  },
  {
    path: '**',
    redirectTo: 'products/all',
  },
];
