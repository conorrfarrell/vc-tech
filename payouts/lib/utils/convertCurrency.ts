// @ts-ignore
import { Convert } from 'easy-currencies';

export default (amount: number, currencyFrom: string, currencyTo: string) => Convert(amount).from(currencyFrom).to(currencyTo);
