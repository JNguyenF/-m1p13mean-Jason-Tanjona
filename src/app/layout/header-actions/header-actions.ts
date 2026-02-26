import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';

import { EcommerceStore } from '../../ecommerce-store';
import { AuthStore } from '../../core/auth/auth.store';

@Component({
  selector: 'app-header-actions',
  imports: [MatButtonModule, MatIconModule, MatBadgeModule, RouterLink, MatFormFieldModule, MatInputModule, FormsModule],
  template: `
 <div class="w-full flex items-center gap-3">
  <div class="flex items-center gap-2 w-[420px] justify-end">
    <mat-form-field appearance="outline" class="w-full max-w-xl">
      <mat-label>Rechercher un article</mat-label>
      <input
        matInput
        [(ngModel)]="query"
        (ngModelChange)="onSearch($event)"
        placeholder="ex: iphone, chaussure..."
      />
    </mat-form-field>
  </div>

  <div class="flex items-center gap-2">
    <button
      mat-icon-button
      routerLink="/favoris"
      [matBadge]="store.wishlistCount()"
      [matBadgeHidden]="store.wishlistCount() === 0"
    >
      <mat-icon>favorite</mat-icon>
    </button>

    <button
      mat-icon-button
      routerLink="/cart"
      [matBadge]="store.cartCount()"
      [matBadgeHidden]="store.cartCount() === 0"
    >
      <mat-icon>shopping_cart</mat-icon>
    </button>

    @if (!auth.isLoggedIn()) {
      <a mat-raised-button color="primary" routerLink="/auth/login" class="rounded-xl">Connectez-vous</a>
      <a mat-stroked-button routerLink="/auth/register" class="rounded-xl">Inscrivez-vous</a>
    } @else {
      @if (auth.role() === 'ADMIN') {
        <a mat-stroked-button routerLink="/admin/boutiques" class="rounded-xl">Admin</a>
      }
      @if (auth.role() === 'STORE') {
        <a mat-stroked-button routerLink="/store/articles" class="rounded-xl">Boutique</a>
      }
      <button mat-raised-button color="primary" (click)="logout()" class="rounded-xl">Déconnexion</button>
    }
  </div>
</div>
  `,
  styles: ``,
})
export class HeaderActions {
  category = input<string>('all');
  store = inject(EcommerceStore);

  categories = signal<string[]>(['all', 'Electronics', 'Fashion', 'Accessoires']);
  auth = inject(AuthStore);

  logout() {
    this.auth.logout();
  }

  onSearch(value: string) {
    this.store.setSearch(value ?? '');
  }
  query = '';

  constructor() {
    
    effect(() => {
      const cat = this.category() ?? 'all';
      this.store.setCategory(cat);
    });
  }
}
