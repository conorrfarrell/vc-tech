import { Item } from './item';

export interface BasicPayout {
  payoutReference?: string
}

export interface Payout extends BasicPayout {
  amount: number,
  currency: string,
  items: Array<Item>,
  sellerReference: string
}
