import { BasicItem, Item } from "../../types/item";
import { Seller } from "../../types/seller";
import { pool } from "../connection";
import { RowDataPacket } from "mysql2";
import convertCurrency from '../../utils/convertCurrency';
import ForbiddenError from "../../errors/forbidden-error";

export const findOne = async (itemId: BasicItem, sellerInfo: Seller) : Promise<Item|null> => {
  const queryString = `SELECT * FROM Item WHERE itemId = ? AND sellerReference = ?`;

  const [rows] = await pool.query(queryString, [itemId, sellerInfo.sellerReference]);
  let row = (<RowDataPacket> rows)[0];

  if (row.payoutReference) throw new ForbiddenError(`Looks like some of these items have already been through payout`);

  if (row) {
    row = {
      ...row,
      currency: sellerInfo.currency,
      amount: Math.round((await convertCurrency(row.amount, row.currency, sellerInfo.currency) + Number.EPSILON) * 100) / 100,
    }
  }

  return row;
};

export const update = async (itemId: number, payoutReference: string) => {
  const queryString = `UPDATE Item SET payoutReference = ? WHERE itemId = ?`;

  return await pool.query(queryString, [payoutReference, itemId]);
}

export const findAll = async (sellerReference: string | null) : Promise<number[]> => {
  let queryString = "SELECT * FROM Item WHERE sellerReference = ? AND payoutReference IS NULL";

  const [rows] = await pool.query(queryString, [sellerReference]);

  const items: number[] = [];
  const rowData = (<RowDataPacket> rows);
  
  rowData.forEach((row: Item) => {
    items.push(row.itemId);
  });

  return items;
};

