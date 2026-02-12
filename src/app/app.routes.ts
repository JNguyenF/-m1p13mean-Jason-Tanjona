import { Routes } from '@angular/router';


export const routes: Routes = [
{
    path:'',
    pathMatch: 'full',
    redirectTo: 'products/all'
},
    {
    path: 'products/:category',
    loadComponent: () => import('./pages/products-grid/products-grid'),
},
 {
    path: 'favoris',
    loadComponent: () => import('./pages/my-wishlist/my-wishlist')
}];
