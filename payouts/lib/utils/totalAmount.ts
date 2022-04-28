import { Item } from '../types/item';

export default (items: Array<Item>) => {
  let total = 0;
  items.map((item: Item) => total += item.amount);

  return total;
};
