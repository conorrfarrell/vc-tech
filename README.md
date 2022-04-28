
# Vestiaire Collective Tech Test

## Technologies

- NodeJS
- Typescript
- MySQL

## Setup

- Clone the repository
- In your MySQL create a database called VC_TECH_TEST
- If you have node already installed navigate to `payouts`
- Update the env file so that it can access your local MySQL
- Update payout transaction limit in the env file if needed
- Run `yarn install`
- Run `yarn start`
- Run Init API request below
- Navigate to your desired API tool and use the API calls below.

## Steps to test with API

Using API titles here for more clarity

- `Get all payouts waiting to be created` This will give you a list of soldItems by their itemIds.
- Use all or a couple of these `itemIds` in the `Trigger new payouts to be created for a particular seller` This will create new payout(s) convert to appropriate currency
- Use `Get all payouts by a seller reference` To get a detail description of the payouts associated to a seller

## API Reference

#### Initialise all tables and basic data

```http
  POST /init
```

No data

#### Get all payouts by a seller reference

```http
  GET /payouts/:sellerReference
```

| Parameter | Type     | Description                |
| :-------- | :------- | :------------------------- |
| `sellerReference` | `string` | **Required**. Reference can be found in the Seller table |

#### Get all payouts waiting to be created

```http
  GET /payouts/:sellerReference/pending
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `sellerReference` | `string` | **Required**. Reference can be found in the Seller table |

#### Trigger new payouts to be created for a particular seller

```http
  POST /payouts/:sellerReference
```

| Parameter | Type     | Description                       |
| :-------- | :------- | :-------------------------------- |
| `sellerReference` | `string` | **Required**. Reference can be found in the Seller table |

| Body | Structure     | Description                       |
| :-------- | :------- | :-------------------------------- |
|  | `{ soldItems: ['itemId1', 'itemId2'] }` | **Required**. You can either supply your own list of items to this or you can take the response from the pending request above |

## Testing
Testing covers the main simple logic of this small application. It will cover the responding with all the data, partial data, and posting data. Throughout the post method subsections are implemented with tests to demonstrate the key utilities that are required to make this application work to its potential.

- Run `yarn test`

## Table structure
If for whatever reason the initalisation does not work for creating a database and tables, see below and copy wherever necessary on your machine:

```
CREATE DATABASE VC_TECH_TEST;

CREATE TABLE Seller (
  sellerReference VARCHAR(50) PRIMARY KEY NOT NULL,
  name VARCHAR(50),
  currency VARCHAR(3),
  email VARCHAR(255)
);

CREATE TABLE Payout (
  payoutReference VARCHAR(50) PRIMARY KEY,
  amount FLOAT,
  currency VARCHAR(3),
  items JSON,
  sellerReference VARCHAR(50),
  FOREIGN KEY (sellerReference) REFERENCES Seller(sellerReference)
);

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

INSERT INTO Seller VALUES ("BURB123", "Burberry", "EUR", "burberry@test.com");
INSERT INTO Item VALUES (1, "Blue shoes", "USD", "1000", "BURB123", null);
INSERT INTO Item VALUES (2, "Red shoes", "USD", "1000", "BURB123", null);
INSERT INTO Item VALUES (3, "Green shoes", "GBP", "499", "BURB123", null);
INSERT INTO Item VALUES (4, "Red shoes", "GBP", "200", "BURB123", null);
INSERT INTO Item VALUES (5, "Yellow shoes", "EUR", "50", "BURB123", null);
INSERT INTO Item VALUES (6, "Purple shoes", "EUR", "500", "BURB123", null);
```

## With more time and for next time
- Docker integration so a Docker SQL driver can be used
- Move init to package script
- More API calls to build service
- Seperate seller data from payouts data create microservices where appropriate (Hence the usage of payouts folder)
