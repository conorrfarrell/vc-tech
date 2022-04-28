export interface BasicItem {
  itemId?: number,
}

export interface Item extends BasicItem {
  name: string,
  currency: string,
  amount: number,
  sellerReference: string
  payoutReference: string,
}
