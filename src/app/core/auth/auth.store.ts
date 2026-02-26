import { Injectable, computed, effect, signal } from '@angular/core';

export type Role = 'ADMIN' | 'STORE' | 'BUYER';

export type User = {
  id: string;
  name: string;
  email: string;
  password: string; // front-only mock
  role: Role;
  shopId?: string; // STORE is linked to a shop
};

export type AuthState = {
  users: User[];
  currentUser: User | null;
};

const LS_KEY = 'e-shopping.auth.v1';

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function safeLoad(): AuthState | null {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) ?? 'null');
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthStore {
  private state = signal<AuthState>(
    safeLoad() ?? {
      users: [
        {
          id: 'admin-1',
          name: 'Admin',
          email: 'admin@baobab.mg',
          password: 'admin123',
          role: 'ADMIN',
        },
      ],
      currentUser: null,
    }
  );

  users = computed(() => this.state().users);
  currentUser = computed(() => this.state().currentUser);
  isLoggedIn = computed(() => !!this.currentUser());
  role = computed(() => this.currentUser()?.role ?? null);

  constructor() {
    effect(() => {
      localStorage.setItem(LS_KEY, JSON.stringify(this.state()));
    });
  }

  register(payload: { name: string; email: string; password: string; role: Role; shopId?: string }) {
    const email = payload.email.trim().toLowerCase();
    if (!email) throw new Error('Email invalide');
    if (this.users().some((u) => u.email === email)) throw new Error('Email déjà utilisé');

    const user: User = {
      id: uid(),
      name: payload.name.trim() || 'Utilisateur',
      email,
      password: payload.password,
      role: payload.role,
      shopId: payload.shopId,
    };

    this.state.update((s) => ({ ...s, users: [...s.users, user], currentUser: user }));
  }


  adminCreateUser(payload: { name: string; email: string; password: string; role: Role; shopId?: string }) {
    // same as register but without logging in
    const email = payload.email.trim().toLowerCase();
    if (!email) throw new Error('Email invalide');
    if (this.users().some((u) => u.email === email)) throw new Error('Email déjà utilisé');

    const user: User = {
      id: uid(),
      name: payload.name.trim() || 'Utilisateur',
      email,
      password: payload.password,
      role: payload.role,
      shopId: payload.shopId,
    };

    this.state.update((s) => ({ ...s, users: [user, ...s.users] }));
    return user;
  }

  login(email: string, password: string) {
    const e = email.trim().toLowerCase();
    const found = this.users().find((u) => u.email === e && u.password === password);
    if (!found) throw new Error('Identifiants incorrects');
    this.state.update((s) => ({ ...s, currentUser: found }));
  }

  logout() {
    this.state.update((s) => ({ ...s, currentUser: null }));
  }
}
