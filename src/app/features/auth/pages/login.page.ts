import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

import { AuthStore } from '../../../core/auth/auth.store';
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
  ],
  template: `
    <div class="min-h-[70vh] grid place-items-center p-4">
      <mat-card class="w-full max-w-md rounded-2xl shadow-xl">
        <div class="p-6">
          <h1 class="text-2xl font-semibold">Connexion</h1>
          <p class="text-sm opacity-70 mt-1">Accédez à votre espace (Admin / Boutique / Client).</p>

          <form [formGroup]="form" (ngSubmit)="submit()" class="mt-6 grid gap-3">
            <mat-form-field appearance="outline">
              <mat-label>Email</mat-label>
              <input matInput formControlName="email" autocomplete="email" />
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Mot de passe</mat-label>
              <input matInput type="password" formControlName="password" autocomplete="current-password" />
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="h-11 rounded-xl">Se connecter</button>

            <div class="flex items-center justify-between text-sm">
              <a routerLink="/auth/register" class="underline">Créer un compte</a>
              <span class="opacity-70">Test Admin: admin@baobab.mg / admin123</span>
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
export default class LoginPage {
  private fb = inject(FormBuilder);
  private auth = inject(AuthStore);
  private router = inject(Router);
  private toast = inject(Toaster);

  error = '';

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit() {
    this.error = '';
    if (this.form.invalid) return;

    const { email, password } = this.form.getRawValue();
    try {
      this.auth.login(email!, password!);
      this.toast.success('Connexion réussie');
      this.router.navigateByUrl('/products/all');
} catch (e: any) {
      this.error = e?.message ?? 'Erreur';
    }
  }
}
