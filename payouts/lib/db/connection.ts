import mysql from "mysql2/promise";
import * as dotenv from "dotenv";

dotenv.config();

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_NAME
});

export const init = async () => {
  let CREATE_TABLE_SELLER = ` 
    CREATE TABLE Seller (
      sellerReference VARCHAR(50) PRIMARY KEY NOT NULL,
      name VARCHAR(50),
      currency VARCHAR(3),
      email VARCHAR(255)
    );
  `;
  await pool.query(CREATE_TABLE_SELLER);

  let CREATE_TABLE_PAYOUT = ` 
    CREATE TABLE Payout (
      payoutReference VARCHAR(50) PRIMARY KEY,
      amount FLOAT,
      currency VARCHAR(3),
      items JSON,
      sellerReference VARCHAR(50),
      FOREIGN KEY (sellerReference) REFERENCES Seller(sellerReference)
    );
  `;
  await pool.query(CREATE_TABLE_PAYOUT);

  let CREATE_TABLE_ITEM = ` 
    CREATE TABLE Item (
      itemId INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50),
      currency VARCHAR(3),
      amount FLOAT,
      sellerReference VARCHAR(50),
      payoutReference VARCHAR(50) NULL,
      FOREIGN KEY (payoutReference) REFERENCES Payout(payoutReference),
      FOREIGN KEY (sellerReference) REFERENCES Seller(sellerReference)
    );
  `;
  await pool.query(CREATE_TABLE_ITEM);

  let INSERT_INTO_SELLER = 'INSERT INTO Seller VALUES ("BURB123", "Burberry", "EUR", "burberry@test.com");';
  await pool.query(INSERT_INTO_SELLER);

  let INSERT_INTO_ITEM = 'INSERT INTO Item VALUES (1, "Blue shoes", "USD", "1000", "BURB123", null), (2, "Red shoes", "USD", "1000", "BURB123", null), (3, "Green shoes", "GBP", "499", "BURB123", null), (4, "Red shoes", "GBP", "200", "BURB123", null), (5, "Yellow shoes", "EUR", "50", "BURB123", null), (6, "Purple shoes", "EUR", "500", "BURB123", null);';
  await pool.query(INSERT_INTO_ITEM);
};


