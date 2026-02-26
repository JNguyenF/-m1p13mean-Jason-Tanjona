import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthStore, Role } from './auth.store';

export const roleGuard: CanActivateFn = (route) => {
  const auth = inject(AuthStore);
  const router = inject(Router);

  const expected = route.data?.['role'] as Role | undefined;
  if (!expected) return true;

  if (!auth.isLoggedIn()) {
    router.navigateByUrl('/auth/login');
    return false;
  }

  if (auth.role() === expected) return true;

  router.navigateByUrl('/');
  return false;
};
