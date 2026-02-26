import { Component, computed, inject, input } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { Product } from '../../models/product';
import { MatAnchor, MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { EcommerceStore } from '../../ecommerce-store';

@Component({
  selector: 'app-product-card',
  imports: [MatAnchor, MatIcon, MatButton, MatIconButton, DecimalPipe],
  template: `
    <div class="relative bg-white cursor-pointer rounded-xl shadow-lg overflow-hidden flex flex-col h-full">
      <img [src]="product().imageUrl" class="w-full h-[300px] object-cover rounded-t-xl"/>

      <button
        matIconButton
        class="!absolute z-10 top-3 right-3 w-10 h-10 rounded-full !bg-white border-0 shadow-md flex items-center justify-center cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg"
        [class]="isInWishlist() ? '!text-red-500' : '!text-gray-400'"
        (click)="toggleWishlist(product()); $event.stopPropagation()"
      >
        <mat-icon>favorite</mat-icon>
      </button>

      <div class="p-5 flex flex-col flex-l">
        <h3 class="text-lg font-semibold text-gray-900 mb-2 leading-tight">
          {{ product().name }}
        </h3>

        <p class="text-sm text-gray-600 mb-4 leading-relaxed">
          {{ product().description }}
        </p>

        <div class="text-sm font-medium mb-4">
          {{ product().inStock ? 'En stock' : 'Pas de stock' }}
        </div>

        <div class="flex items-center justify-between mt-auto">
          <span class="text-xl font-bold text-gray-700">{{ product().price | number }} Ar</span>

          <button
            matButton="filled"
            class="flex items-center gap-2"
            (click)="addToCart(product()); $event.stopPropagation()"
          >
            <mat-icon>shopping_cart</mat-icon>
            Panier
          </button>
        </div>
      </div>
    </div>
  `,
  styles: ``,
})
export class ProductCard {
  product = input.required<Product>();

  store = inject(EcommerceStore);

  isInWishlist = computed(() => !!this.store.wishlistItems().find((p) => p.id === this.product().id));

  toggleWishlist(product: Product) {
    this.store.toggleWishlist(product);
  }

  addToCart(product: Product) {
    this.store.addToCart(product);
  }
}
