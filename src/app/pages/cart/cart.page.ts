import { Component, computed, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { EcommerceStore } from '../../ecommerce-store';

@Component({
  selector: 'app-cart-page',
  imports: [
    CommonModule,
    DecimalPipe,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  template: `
  <div class="p-4 max-w-6xl mx-auto">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-bold">Mon panier</h1>
      <a mat-stroked-button routerLink="/products/all">Continuer les achats</a>
    </div>

    @if (items().length === 0) {
      <mat-card class="p-6 text-center">
        <div class="text-lg font-semibold">Panier vide</div>
        <div class="opacity-70 mt-1">Ajoute des articles depuis la page Produits.</div>
      </mat-card>
    } @else {
      <div class="grid gap-4 lg:grid-cols-[1fr_320px]">
        <div class="grid gap-3">
          @for (it of items(); track it.product.id) {
            <mat-card class="p-3 rounded-2xl">
              <div class="flex gap-3">
                <img [src]="it.product.imageUrl" class="w-24 h-24 rounded-xl object-cover" />
                <div class="flex-1">
                  <div class="font-semibold">{{ it.product.name }}</div>
                  <div class="text-sm opacity-70">{{ it.product.category }}</div>
                  <div class="font-bold mt-1">{{ it.product.price | number }} Ar</div>

                  <div class="flex items-center gap-2 mt-2">
                    <button mat-icon-button (click)="dec(it.product.id)">
                      <mat-icon>remove</mat-icon>
                    </button>

                    <input
                      class="w-16 border rounded-lg px-2 py-1 text-center"
                      type="number"
                      [value]="it.qty"
                      min="1"
                      (change)="setQty(it.product.id, $any($event.target).value)"
                    />

                    <button mat-icon-button (click)="inc(it.product.id)">
                      <mat-icon>add</mat-icon>
                    </button>

                    <span class="ml-auto font-semibold">
                      {{ (it.qty * it.product.price) | number }} Ar
                    </span>

                    <button mat-icon-button (click)="remove(it.product.id)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                </div>
              </div>
            </mat-card>
          }
        </div>

        <mat-card class="p-4 rounded-2xl h-fit">
          <div class="text-lg font-semibold">Résumé</div>
          <div class="mt-3 grid gap-2 text-sm">
            <div class="flex justify-between">
              <span>Articles</span>
              <span>{{ store.cartCount() }}</span>
            </div>
            <div class="flex justify-between text-base font-bold">
              <span>Total</span>
              <span>{{ store.cartTotal() | number }} Ar</span>
            </div>
          </div>

          <div class="mt-4 grid gap-2">
            <button mat-raised-button color="primary" (click)="checkout()">
              Passer commande
            </button>
            <button mat-stroked-button (click)="clear()">
              Vider le panier
            </button>
          </div>
        </mat-card>
      </div>
    }
  </div>
  `,
  styles: ``,
})
export default class CartPage {
  store = inject(EcommerceStore);
  private router = inject(Router);

  items = computed(() => this.store.cartItems());

  inc(id: string) {
    const it = this.items().find(x => x.product.id === id);
    this.store.setCartQty(id, (it?.qty ?? 1) + 1);
  }

  dec(id: string) {
    const it = this.items().find(x => x.product.id === id);
    const next = Math.max(1, (it?.qty ?? 1) - 1);
    this.store.setCartQty(id, next);
  }

  setQty(id: string, qty: any) {
    this.store.setCartQty(id, Number(qty));
  }

  remove(id: string) {
    this.store.removeFromCart(id);
  }

  clear() {
    this.store.clearCart();
  }

  checkout() {
    // front-only: just clear and go back
    this.store.clearCart();
    this.router.navigateByUrl('/products/all');
  }
}
