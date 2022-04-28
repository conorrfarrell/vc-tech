import { Payout } from "../../types/payout";
import { pool } from "../connection";
import { RowDataPacket } from "mysql2";

export const create = async (payout: Payout) : Promise<Payout> => {
  const queryString = "INSERT INTO Payout (payoutReference, amount, currency, items, sellerReference) VALUES (?, ?, ?, ?, ?)"

  const [rows] = await pool.query(queryString, [payout.payoutReference, payout.amount, payout.currency, JSON.stringify(payout.items), payout.sellerReference]);
  const row = (<RowDataPacket> rows)[0];

  return row;
};

export const findAll = async (sellerReference: string | null) : Promise<Array<Payout>> => {
  let queryString = "SELECT * FROM Payout WHERE sellerReference = ?";

  const [rows] = await pool.query(queryString, [sellerReference]);

  const payouts: Array<Payout> = [];
  const items = (<RowDataPacket> rows);
  
  items.forEach((row: Payout) => {
    payouts.push({
      payoutReference: row.payoutReference,
      amount: row.amount,
      currency: row.currency,
      items: row.items,
      sellerReference: row.sellerReference
    });
  });

  return payouts;
};
