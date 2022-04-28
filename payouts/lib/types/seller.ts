export interface BasicSeller {
  sellerReference?: string,
}

export interface Seller extends BasicSeller {
  name: string,
  email: string,
  currency: string;
}
