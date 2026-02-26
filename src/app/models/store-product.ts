import { Product } from './product';

export type StoreProduct = Product & {
  shopId: string;
};
