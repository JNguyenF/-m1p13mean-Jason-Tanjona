import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class Toaster {
  private snack = inject(MatSnackBar);

  success(message: string) {
    this.snack.open(message, 'OK', { duration: 2000, verticalPosition: 'top' });
  }

  error(message: string) {
    this.snack.open(message, 'Fermer', { duration: 3000, verticalPosition: 'top' });
  }
}
