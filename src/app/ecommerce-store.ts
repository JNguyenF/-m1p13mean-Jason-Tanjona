import { computed, inject } from '@angular/core';
import { Product } from './models/product';
import { patchState, signalMethod, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { produce } from 'immer';
import { Toaster } from './services/toaster';

export type CartItem = {
  product: Product;
  qty: number;
};

export type EcommerceState = {
  products: Product[];
  category: string;
  search: string;
  wishlistItems: Product[];
  cartItems: CartItem[];
};

export const EcommerceStore = signalStore(
  { providedIn: 'root' },

  withState({
    products: [
      {
        id: '1',
        name: 'Iphone 13 Pro Max',
        description: 'IOS 16 avec écran 6.5 pouces et 128GB stockage.',
        price: 850000,
        imageUrl: 'https://specs.yugatech.com/wp-content/uploads/2022/08/main1.jpg',
        rating: 4.5,
        reviewCount: 120,
        inStock: 15,
        category: 'Electronics',
      },
      {
        id: '2',
        name: 'Chaussures Nike Air',
        description: 'Chaussures de sport confortables et légères.',
        price: 250000,
        imageUrl: 'https://tse2.mm.bing.net/th/id/OIP.A6zNkRVpB4u3Hr7MUUKQlAHaFi?rs=1&pid=ImgDetMain&o=7&rm=3',
        rating: 4.8,
        reviewCount: 89,
        inStock: 30,
        category: 'Fashion',
      },
      {
        id: '3',
        name: 'Sac à main Femme',
        description: 'Sac élégant en cuir pour usage quotidien.',
        price: 120000,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80',
        rating: 4.2,
        reviewCount: 45,
        inStock: 20,
        category: 'Accessoires',
      },
      {
        id: '4',
        name: 'TV LED 43 pouces',
        description: 'Télévision Full HD avec connexion HDMI et USB.',
        price: 1200000,
        imageUrl: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=1200&q=80',
        rating: 4.6,
        reviewCount: 60,
        inStock: 10,
        category: 'Electronics',
      },
      {
        id: '5',
        name: 'Casque Bluetooth',
        description: 'Casque sans fil avec réduction de bruit.',
        price: 150000,
        imageUrl: 'https://images.unsplash.com/photo-1518444028785-8c6f4c8f6c7d?auto=format&fit=crop&w=1200&q=80',
        rating: 4.3,
        reviewCount: 75,
        inStock: 25,
        category: 'Electronics',
      },
    ],
    category: 'all',
    search: '',
    wishlistItems: [],
    cartItems: [],
  } as EcommerceState),

  withComputed(({ category, products, wishlistItems, cartItems, search }) => ({
    filteredProducts: computed(() => {
      const cat = (category() ?? 'all').toLowerCase();
      const q = (search() ?? '').trim().toLowerCase();

      const byCat = cat === 'all'
        ? products()
        : products().filter((p) => (p.category ?? '').toLowerCase() === cat);

      if (!q) return byCat;

      return byCat.filter((p) => {
        const hay = `${p.name} ${p.description} ${p.category}`.toLowerCase();
        return hay.includes(q);
      });
    }),

    wishlistCount: computed(() => wishlistItems().length),

    cartCount: computed(() => cartItems().reduce((sum, it) => sum + (it.qty ?? 0), 0)),

    cartTotal: computed(() =>
      cartItems().reduce((sum, it) => sum + (it.qty ?? 0) * (it.product?.price ?? 0), 0)
    ),
  })),

  withMethods((store, toaster = inject(Toaster)) => ({
    setCategory: signalMethod<string>((category: string) => {
      patchState(store, { category });
    }),

    setSearch: signalMethod<string>((search: string) => {
      patchState(store, { search });
    }),

    addToWishlist: (product: Product) => {
      const updated = produce(store.wishlistItems(), (draft) => {
        if (!draft.find((p) => p.id === product.id)) draft.push(product);
      });
      patchState(store, { wishlistItems: updated });
      toaster.success('Ajouté aux favoris');
    },

    removeFromWishlist: (productId: string) => {
      patchState(store, { wishlistItems: store.wishlistItems().filter((p) => p.id !== productId) });
      toaster.success('Retiré des favoris');
    },

    toggleWishlist: (product: Product) => {
      const exists = store.wishlistItems().some((p) => p.id === product.id);
      if (exists) {
        patchState(store, { wishlistItems: store.wishlistItems().filter((p) => p.id !== product.id) });
        toaster.success('Retiré des favoris');
      } else {
        patchState(store, { wishlistItems: [...store.wishlistItems(), product] });
        toaster.success('Ajouté aux favoris');
      }
    },

    addToCart: (product: Product) => {
      const next = produce(store.cartItems(), (draft) => {
        const found = draft.find((it) => it.product.id === product.id);
        if (found) found.qty += 1;
        else draft.unshift({ product, qty: 1 });
      });
      patchState(store, { cartItems: next });
      toaster.success('Ajouté au panier');
    },

    removeFromCart: (productId: string) => {
      patchState(store, { cartItems: store.cartItems().filter((it) => it.product.id !== productId) });
      toaster.success('Retiré du panier');
    },

    setCartQty: (productId: string, qty: number) => {
      const safeQty = Math.max(1, Math.floor(Number(qty) || 1));
      const next = produce(store.cartItems(), (draft) => {
        const it = draft.find((x) => x.product.id === productId);
        if (it) it.qty = safeQty;
      });
      patchState(store, { cartItems: next });
    },

    clearCart: () => {
      patchState(store, { cartItems: [] });
      toaster.success('Panier vidé');
    },
  }))
);
