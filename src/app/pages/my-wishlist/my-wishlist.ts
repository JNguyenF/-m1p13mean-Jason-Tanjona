import { Component, computed, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { EcommerceStore } from '../../ecommerce-store';

@Component({
  selector: 'app-my-wishlist',
  imports: [CommonModule, DecimalPipe, RouterLink, MatButtonModule, MatIconModule, MatCardModule],
  template: `
  <div class="p-4 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Mes favoris</h1>
      <a mat-stroked-button routerLink="/products/all">Retour aux produits</a>
    </div>

    @if (items().length === 0) {
      <mat-card class="p-6 text-center">
        <div class="text-lg font-semibold">Aucun favori</div>
        <div class="opacity-70 mt-1">Ajoute des articles avec le coeur ❤️</div>
      </mat-card>
    } @else {
      <div class="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        @for (p of items(); track p.id) {
          <mat-card class="overflow-hidden rounded-2xl">
            <img [src]="p.imageUrl" class="w-full h-44 object-cover" />
            <div class="p-4 grid gap-2">
              <div class="font-semibold">{{ p.name }}</div>
              <div class="text-sm opacity-70">{{ p.category }}</div>
              <div class="font-bold">{{ p.price | number }} Ar</div>

              <div class="flex gap-2">
                <button mat-raised-button color="primary" (click)="addToCart(p)">
                  <mat-icon>shopping_cart</mat-icon>
                  Panier
                </button>
                <button mat-stroked-button (click)="remove(p.id)">
                  <mat-icon>delete</mat-icon>
                  Retirer
                </button>
              </div>
            </div>
          </mat-card>
        }
      </div>
    }
  </div>
  `,
  styles: ``,
})
export default class MyWishlist {
  private store = inject(EcommerceStore);

  items = computed(() => this.store.wishlistItems());

  remove(id: string) {
    this.store.removeFromWishlist(id);
  }

  addToCart(p: any) {
    this.store.addToCart(p);
  }
}
