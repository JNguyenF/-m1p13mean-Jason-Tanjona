import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { Toaster } from '../../../services/toaster';
import { AuthStore } from '../../../core/auth/auth.store';

type Shop = {
  id: string;
  name: string;
  ownerEmail: string;
  description: string;
  logoUrl?: string;
};

const LS_KEY = 'e-shopping.shops.v1';

function uid(prefix = 'shop') {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

function loadShops(): Shop[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? '[]');
  } catch {
    return [];
  }
}

function saveShops(shops: Shop[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(shops));
}

@Component({
  selector: 'app-admin-boutiques',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSlideToggleModule,
  ],
  template: `
  <div class="p-4 max-w-6xl mx-auto">
    <div class="grid gap-4">
      <mat-card class="rounded-2xl">
        <div class="p-6">
          <div class="flex items-center justify-between gap-4 flex-wrap">
            <div>
              <h2 class="text-2xl font-bold">Gestion des boutiques</h2>
              <p class="opacity-70 mt-1">
                Créez une boutique (Shop ID) et, optionnellement, créez automatiquement le compte Boutique (STORE).
              </p>
            </div>
            <div class="text-sm opacity-70">Total: {{ shops().length }}</div>
          </div>

          <form [formGroup]="form" (ngSubmit)="create()" class="mt-5 grid gap-3 md:grid-cols-2">
            <mat-form-field appearance="outline">
              <mat-label>Nom boutique</mat-label>
              <input matInput formControlName="name" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Email propriétaire</mat-label>
              <input matInput formControlName="ownerEmail" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="md:col-span-2">
              <mat-label>Description</mat-label>
              <input matInput formControlName="description" />
            </mat-form-field>

            <mat-form-field appearance="outline" class="md:col-span-2">
              <mat-label>Logo URL (optionnel)</mat-label>
              <input matInput formControlName="logoUrl" />
            </mat-form-field>

            <div class="md:col-span-2 flex items-center justify-between flex-wrap gap-3">
              <mat-slide-toggle formControlName="createStoreAccount">
                Créer un compte Boutique automatiquement
              </mat-slide-toggle>

              <div class="text-sm opacity-70">
                Par défaut, email = propriétaire, mot de passe = <b>store123</b>
              </div>
            </div>

            @if (form.get('createStoreAccount')?.value) {
              <mat-form-field appearance="outline" class="md:col-span-2">
                <mat-label>Mot de passe Boutique</mat-label>
                <input matInput type="password" formControlName="storePassword" />
              </mat-form-field>
            }

            <div class="md:col-span-2 flex justify-end">
              <button mat-raised-button color="primary" class="rounded-xl" type="submit" [disabled]="form.invalid">
                <mat-icon>add</mat-icon>
                Créer
              </button>
            </div>
          </form>
        </div>
      </mat-card>

      <mat-card class="rounded-2xl">
        <div class="p-6">
          <h3 class="text-lg font-semibold">Boutiques</h3>

          @if (shops().length === 0) {
            <div class="opacity-70 mt-2">Aucune boutique.</div>
          } @else {
            <div class="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              @for (s of shops(); track s.id) {
                <div class="border rounded-2xl overflow-hidden bg-white">
                  <div class="p-4 flex items-center gap-3">
                    <img *ngIf="s.logoUrl" [src]="s.logoUrl" class="w-12 h-12 rounded-xl object-cover" />
                    <div class="min-w-0">
                      <div class="font-semibold truncate">{{ s.name }}</div>
                      <div class="text-sm opacity-70 truncate">{{ s.ownerEmail }}</div>
                    </div>
                    <button mat-icon-button class="ml-auto" (click)="remove(s.id)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>

                  <div class="px-4 pb-4 grid gap-2 text-sm">
                    <div class="opacity-80">{{ s.description }}</div>

                    <div class="flex items-center justify-between gap-2">
                      <span class="opacity-70">Shop ID</span>
                      <button mat-stroked-button class="rounded-xl" (click)="copy(s.id)">
                        <mat-icon>content_copy</mat-icon>
                        Copier
                      </button>
                    </div>
                    <div class="font-mono text-xs bg-gray-100 rounded-xl p-2 overflow-x-auto">{{ s.id }}</div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </mat-card>
    </div>
  </div>
  `,
})
export default class AdminBoutiquesPage {
  private fb = inject(FormBuilder);
  private toast = inject(Toaster);
  private auth = inject(AuthStore);

  shops = signal<Shop[]>(loadShops());

  form = this.fb.group({
    name: ['', Validators.required],
    ownerEmail: ['', [Validators.required, Validators.email]],
    description: ['', Validators.required],
    logoUrl: [''],
    createStoreAccount: [true],
    storePassword: ['store123', [Validators.minLength(4)]],
  });

  create() {
    if (this.form.invalid) return;

    const v = this.form.getRawValue();
    const id = uid('shop');

    const shop: Shop = {
      id,
      name: v.name!.trim(),
      ownerEmail: v.ownerEmail!.trim().toLowerCase(),
      description: v.description!.trim(),
      logoUrl: (v.logoUrl ?? '').trim() || undefined,
    };

    const next = [shop, ...this.shops()];
    this.shops.set(next);
    saveShops(next);

    // Optional: create STORE user (front-only) linked to this shop
    if (v.createStoreAccount) {
      try {
        this.auth.adminCreateUser({
          name: shop.name,
          email: shop.ownerEmail,
          password: v.storePassword || 'store123',
          role: 'STORE',
          shopId: shop.id,
        });
        this.toast.success('Boutique + compte Boutique créés');
      } catch (e: any) {
        this.toast.success('Boutique créée (compte Boutique non créé : ' + (e?.message ?? 'erreur') + ')');
      }
    } else {
      this.toast.success('Boutique créée');
    }

    this.form.reset({
      name: '',
      ownerEmail: '',
      description: '',
      logoUrl: '',
      createStoreAccount: true,
      storePassword: 'store123',
    });
  }

  remove(id: string) {
    const next = this.shops().filter((s) => s.id !== id);
    this.shops.set(next);
    saveShops(next);
    this.toast.success('Boutique supprimée');
  }

  async copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      this.toast.success('Shop ID copié');
    } catch {
      this.toast.success('Impossible de copier (autorisation navigateur)');
    }
  }
}
