
import { pool } from "../connection";
import { Seller } from '../../types/seller';
import { RowDataPacket } from "mysql2";
import NotFoundError from '../../errors/not-found-error';

export const findOne = async (sellerReference: String) : Promise<Seller> => {
  const queryString = `SELECT * FROM Seller WHERE sellerReference = ?`;

  const [rows] = await pool.query(queryString, [sellerReference]);
  const row = (<RowDataPacket> rows)[0];

  if (!row) throw new NotFoundError('There is no seller with this name');

  return row;
};

