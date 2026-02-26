// import { Component, computed, effect, inject, input, signal } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterLink } from '@angular/router';

// import { MatSidenavContainer, MatSidenavContent, MatSidenav } from '@angular/material/sidenav';
// import { MatNavList, MatListItem, MatListItemTitle } from '@angular/material/list';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';

// import { ProductCard } from '../../components/product-card/product-card';
// import { EcommerceStore } from '../../ecommerce-store';

// @Component({
//   selector: 'app-products-grid',
//   imports: [
//     CommonModule,
//     FormsModule,
//     RouterLink,
//     ProductCard,
//     MatSidenavContainer,
//     MatSidenavContent,
//     MatSidenav,
//     MatNavList,
//     MatListItem,
//     MatListItemTitle,
//     MatFormFieldModule,
//     MatInputModule,
//   ],
//   template: `
// <mat-sidenav-container class="h-full">
//   <mat-sidenav mode="side" opened class="w-64 bg-white border-r">
//     <div class="p-4 font-bold text-lg">Catégories</div>
//     <mat-nav-list>
//       @for (cat of categories(); track cat) {
//         <mat-list-item [routerLink]="'/products/' + cat">
//           <span matListItemTitle class="capitalize">
//             {{ cat | titlecase }}
//           </span>
//         </mat-list-item>
//       }
//     </mat-nav-list>
//   </mat-sidenav>

//   <mat-sidenav-content class="bg-gray-100 p-6 h-full">
//     <div class="flex items-center justify-between gap-4 flex-wrap">
//       <h1 class="text-2xl font-bold text-gray-900 capitalize">{{ category() }}</h1>

//       <!-- <mat-form-field appearance="outline" class="min-w-[260px]">
//         <mat-label>Rechercher un article</mat-label>
//         <input matInput [(ngModel)]="query" (ngModelChange)="onSearch($event)" placeholder="ex: iphone, chaussure..." />
//       </mat-form-field> -->
//     </div>

//     <div class="responsive-grid mt-4">
//       @for (product of store.filteredProducts(); track product.id) {
//         <app-product-card [product]="product"/>
//       }
//     </div>
//   </mat-sidenav-content>
// </mat-sidenav-container>
//   `,
//   styles: ``,
// })
// export default class ProductsGrid {
//   category = input<string>('all');
//   store = inject(EcommerceStore);

//   categories = signal<string[]>(['all', 'Electronics', 'Fashion', 'Accessoires']);

//   query = '';

//   constructor() {
    
//     effect(() => {
//       const cat = this.category() ?? 'all';
//       this.store.setCategory(cat);
//     });
//   }

//   onSearch(value: string) {
//     this.store.setSearch(value ?? '');
//   }
// }
