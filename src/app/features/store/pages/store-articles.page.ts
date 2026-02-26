import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AuthStore } from '../../../core/auth/auth.store';
import { Shop } from '../../../models/shop';
import { StoreProduct } from '../../../models/store-product';
import { lsLoad, lsSave, uid } from '../../../services/storage';
import { Toaster } from '../../../services/toaster';

const PRODUCTS_KEY = 'e-shopping.store-products.v1';
const SHOPS_KEY = 'e-shopping.shops.v1';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    DecimalPipe,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  template: `
    <div class="max-w-6xl mx-auto p-4 grid gap-4">
      <mat-card class="rounded-2xl">
        <div class="p-6">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-xl font-semibold">Boutique — Gestion des articles</h2>
              <p class="text-sm opacity-70">
                Ajoutez, modifiez et supprimez vos produits (front uniquement).
              </p>
            </div>
            <div class="text-sm bg-gray-100 rounded-xl px-3 py-2">
              Shop ID: <span class="font-mono">{{ shopId() || 'non défini' }}</span>
            </div>
          </div>

          @if (!shopId()) {
            <div class="mt-4 p-4 rounded-2xl border bg-yellow-50 text-sm">
              <b>Shop ID manquant.</b>
              <div class="opacity-80 mt-1">
                Demandez à l'admin de créer votre boutique, puis copiez le Shop ID dans votre compte (Register → Boutique).
              </div>
            </div>
          }

          <form [formGroup]="form" (ngSubmit)="create()" class="mt-5 grid gap-3 md:grid-cols-2">
            <mat-form-field appearance="outline">
              <mat-label>Nom produit</mat-label>
              <input matInput formControlName="name" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Catégorie</mat-label>
              <input matInput formControlName="category" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="md:col-span-2">
              <mat-label>Description</mat-label>
              <input matInput formControlName="description" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Prix (Ar)</mat-label>
              <input matInput type="number" formControlName="price" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Stock</mat-label>
              <input matInput type="number" formControlName="inStock" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="md:col-span-2">
              <mat-label>Image URL</mat-label>
              <input matInput formControlName="imageUrl" />
            </mat-form-field>

            <div class="md:col-span-2 flex gap-2">
              <button mat-raised-button color="primary" type="submit" class="rounded-xl" [disabled]="!shopId()">
                Ajouter
              </button>
              <button mat-stroked-button type="button" (click)="form.reset(defaults)" class="rounded-xl">
                Réinitialiser
              </button>
            </div>
          </form>
        </div>
      </mat-card>

      <mat-card class="rounded-2xl">
        <div class="p-6">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold">Mes articles</h3>
            <span class="text-sm opacity-70">{{ myProducts().length }} article(s)</span>
          </div>

          <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            @for (p of myProducts(); track p.id) {
              <div class="border rounded-2xl overflow-hidden bg-white">
                <div class="relative">
                  <img [src]="p.imageUrl" class="w-full h-48 object-cover" />
                  <button mat-icon-button class="absolute top-2 right-2 bg-white/90 rounded-full" (click)="remove(p.id)">
                    <mat-icon>delete</mat-icon>
                  </button>
                </div>
                <div class="p-4 grid gap-1">
                  <div class="font-semibold">{{ p.name }}</div>
                  <div class="text-sm opacity-70">{{ p.category }}</div>
                  <div class="font-bold">{{ p.price | number }} Ar</div>
                  <div class="text-sm">Stock: {{ p.inStock }}</div>
                  <div class="text-sm opacity-80">{{ p.description }}</div>
                </div>
              </div>
            }
          </div>
        </div>
      </mat-card>
    </div>
  `,
})
export default class StoreArticlesPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthStore);
  private toast = inject(Toaster);

  allProducts = signal<StoreProduct[]>(lsLoad<StoreProduct[]>(PRODUCTS_KEY, []));
  shops = signal<Shop[]>(lsLoad<Shop[]>(SHOPS_KEY, []));

  shopId = computed(() => {
    const user = this.auth.currentUser();
    if (!user) return '';
    if (user.shopId) return user.shopId;
    // fallback: match by ownerEmail
    const match = this.shops().find((s) => s.ownerEmail === user.email);
    return match?.id ?? '';
  });

  myProducts = computed(() => {
    const sid = this.shopId();
    if (!sid) return [];
    return this.allProducts().filter((p) => p.shopId === sid);
  });

  defaults = {
    name: '',
    category: 'General',
    description: '',
    price: 0,
    inStock: 0,
    imageUrl:
      'https://images.unsplash.com/photo-1518444028785-8c6f4c8f6c7d?auto=format&fit=crop&w=1200&q=80',
  };

  form = this.fb.group({
    name: [this.defaults.name, Validators.required],
    category: [this.defaults.category, Validators.required],
    description: [this.defaults.description, Validators.required],
    price: [this.defaults.price, [Validators.required, Validators.min(0)]],
    inStock: [this.defaults.inStock, [Validators.required, Validators.min(0)]],
    imageUrl: [this.defaults.imageUrl, Validators.required],
  });

  create() {
    if (!this.shopId()) return;
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    const p: StoreProduct = {
      id: uid('p_'),
      shopId: this.shopId(),
      name: v.name!.trim(),
      category: v.category!.trim(),
      description: v.description!.trim(),
      price: Number(v.price),
      imageUrl: v.imageUrl!.trim(),
      rating: 0,
      reviewCount: 0,
      inStock: Number(v.inStock),
    };
    const next = [p, ...this.allProducts()];
    this.allProducts.set(next);
    lsSave(PRODUCTS_KEY, next);
    this.toast.success('Article ajouté');
    this.form.reset(this.defaults);
  }

  remove(id: string) {
    const next = this.allProducts().filter((p) => p.id !== id);
    this.allProducts.set(next);
    lsSave(PRODUCTS_KEY, next);
    this.toast.success('Article supprimé');
  }
}
