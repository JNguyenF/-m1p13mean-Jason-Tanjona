import { Component, computed, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { AuthStore, Role } from '../../../core/auth/auth.store';
import { Toaster } from '../../../services/toaster';

@Component({
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
  ],
  template: `
    <div class="min-h-[70vh] grid place-items-center p-4">
      <mat-card class="w-full max-w-lg rounded-2xl shadow-xl">
        <div class="p-6">
          <h1 class="text-2xl font-semibold">Créer un compte</h1>
          <p class="text-sm opacity-70 mt-1">Choisissez votre profil.</p>

          <form [formGroup]="form" (ngSubmit)="submit()" class="mt-6 grid gap-3">
            <div class="grid gap-3 md:grid-cols-2">
              <mat-form-field appearance="outline">
                <mat-label>Nom</mat-label>
                <input matInput formControlName="name" autocomplete="name" />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Rôle</mat-label>
                <mat-select formControlName="role">
                  <mat-option value="BUYER">Utilisateur</mat-option>
                  <mat-option value="STORE">Boutique</mat-option>
                  <mat-option value="ADMIN">Admin</mat-option>
                </mat-select>
              </mat-form-field>
            </div>

            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" autocomplete="email" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Mot de passe</mat-label>
              <input matInput type="password" formControlName="password" autocomplete="new-password" />
            </mat-form-field>

            @if (isStore()) {
              <mat-form-field appearance="outline">
                <mat-label>Shop ID (fourni par l'admin)</mat-label>
                <input matInput formControlName="shopId" placeholder="ex: shop_ab12cd34" />
              </mat-form-field>
              <p class="text-xs opacity-70 -mt-2">
                Si vous n'avez pas encore de Shop ID, demandez à l'admin de créer votre boutique.
              </p>
            }

            <button mat-raised-button color="primary" type="submit" class="h-11 rounded-xl">Créer</button>

            <div class="text-sm">
              <a routerLink="/auth/login" class="underline">J'ai déjà un compte</a>
            </div>

            @if (error) {
              <div class="text-sm text-red-600">{{ error }}</div>
            }
          </form>
        </div>
      </mat-card>
    </div>
  `,
})
export default class RegisterPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthStore);
  private router = inject(Router);
  private toast = inject(Toaster);

  error = '';

  form = this.fb.group({
    name: ['', Validators.required],
    role: ['BUYER' as Role, Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    shopId: [''],
  });

  isStore = computed(() => this.form.get('role')?.value === 'STORE');

  submit() {
    this.error = '';
    if (this.form.invalid) return;
    const v = this.form.getRawValue();
    try {
      this.auth.register({
        name: v.name!,
        email: v.email!,
        password: v.password!,
        role: v.role!,
        shopId: v.role === 'STORE' ? (v.shopId?.trim() || undefined) : undefined,
      });
      this.toast.success('Compte créé');

      const role = this.auth.role();
      if (role === 'ADMIN') this.router.navigateByUrl('/admin/boutiques');
      else if (role === 'STORE') this.router.navigateByUrl('/store/articles');
      else this.router.navigateByUrl('/');
    } catch (e: any) {
      this.error = e?.message ?? 'Erreur';
    }
  }
}
