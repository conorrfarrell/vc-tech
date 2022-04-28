import request from 'supertest';
import api from '../lib/api/routes';
import * as payoutModel from "../lib/db/models/payout";
import * as sellerModel from "../lib/db/models/seller";
import * as itemModel from "../lib/db/models/item";

jest.mock('uuid', () => ({ v4: () => 'b2cc7654-1d82-4200-97e5-20ed0e4aee45' }));

jest.mock('../lib/db/models/item', () => ({
  findAll: jest.fn(() => Promise.resolve([
    {
      name: "Purple shoes",
      amount: 500,
      itemId: 6,
      currency: "EUR",
      payoutReference: null,
      sellerReference: "BURB123"
    }
  ])),
  findOne: jest.fn(() => Promise.resolve({
    amount: 200,
    currency: "EUR",
    itemId: 6,
    name: "Red shoes",
    payoutReference: null,
    sellerReference: "BURB123"
  })),
  update: jest.fn(() => Promise.resolve(
    {
      name: "Red shoes",
      amount: 200,
      itemId: 6,
      currency: "EUR",
      payoutReference: "b2cc7654-1d82-4200-97e5-20ed0e4aee45",
      sellerReference: "BURB123"
    }
  ))
}));

jest.mock('../lib/db/models/payout', () => ({
  findAll: jest.fn(() => Promise.resolve({
    payoutReference: "37632cbd-4ef2-442b-a723-7fd363f52b21",
    amount: 788,
    currency: "EUR",
    items: [
      {
        name: "Purple shoes",
        amount: 500,
        itemId: 6,
        currency: "EUR",
        payoutReference: null,
        sellerReference: "BURB123"
      }
    ],
    sellerReference: "BURB123"
  })),
  create: jest.fn(() => Promise.resolve({
    payoutReference: "37632cbd-4ef2-442b-a723-7fd363f52b21",
    amount: 788,
    currency: "EUR",
    items: [
      {
        name: "Purple shoes",
        amount: 500,
        itemId: 6,
        currency: "EUR",
        payoutReference: null,
        sellerReference: "BURB123"
      }
    ],
    sellerReference: "BURB123"
  }))
}));

jest.mock('../lib/db/models/seller', () => ({
  findOne: jest.fn(() => Promise.resolve({
    name: 'Burberry',
    currency: 'USD',
    email: 'burberry@test.com',
    sellerReference: 'BURB123'
  })),
}));

jest.mock('../lib/db/connection');

const payoutFindAll = payoutModel.findAll as jest.MockedFunction<typeof payoutModel.findAll>;
const payoutCreate = payoutModel.create as jest.MockedFunction<typeof payoutModel.create>;

const itemFindAll = itemModel.findAll as jest.MockedFunction<typeof itemModel.findAll>;
const itemFindOne = itemModel.findOne as jest.MockedFunction<typeof itemModel.findOne>;
const itemUpdate = itemModel.update as jest.MockedFunction<typeof itemModel.update>;

const sellerFindOne = sellerModel.findOne as jest.MockedFunction<typeof sellerModel.findOne>;


describe('API', () => {
  beforeEach(() => {
    sellerFindOne.mockClear();
    itemFindAll.mockClear();
    itemFindOne.mockClear();
    itemUpdate.mockClear();
    payoutFindAll.mockClear();
    payoutCreate.mockClear();
  });

  test('Get all payouts by seller reference', async (done) => {
    const res = await request(api)
      .get('/payouts/BURB123')
      .expect(200);

    expect(sellerFindOne).toBeCalledWith("BURB123");
    expect(payoutFindAll).toBeCalledWith("BURB123");
    
    expect(res.body).toEqual({
      "amount": 788,
      "currency": "EUR",
      "items": [
        {"amount": 500,
        "currency": "EUR",
        "itemId": 6,
        "name": "Purple shoes",
        "payoutReference": null,
        "sellerReference": "BURB123"}
      ],
      "payoutReference": "37632cbd-4ef2-442b-a723-7fd363f52b21",
      "sellerReference": "BURB123"});

    done();
  });

  test('Get all sold items not yet in payouts', async (done) => {
    const res = await request(api)
      .get('/payouts/BURB123/pending')
      .expect(200);

    expect(sellerFindOne).toBeCalledWith("BURB123");
    expect(itemFindAll).toBeCalledWith("BURB123");
    
    expect(res.body).toEqual({
      "soldItems": [
        {
          "amount": 500,
          "currency": "EUR",
          "itemId": 6,
          "name": "Purple shoes",
          "payoutReference": null,
          "sellerReference": "BURB123",
        }
      ]
    });

    done();
  });

  test('Trigger payout for unsold item', async (done) => {
    const res = await request(api)
      .post('/payouts/BURB123')
      .send({ "soldItems": [1] })
      .expect(200);

    expect(sellerFindOne).toBeCalledWith("BURB123");
    expect(itemFindOne).toHaveBeenCalledWith(1, {"currency": "USD", "email": "burberry@test.com", "name": "Burberry", "sellerReference": "BURB123"});
    expect(itemUpdate).toBeCalledWith(6, "b2cc7654-1d82-4200-97e5-20ed0e4aee45");
    expect(payoutCreate).toBeCalledWith({
      amount: 200,
      currency: "USD",
      items: [
        {
          amount: 200,
          currency: "EUR",
          itemId: 6,
          name: "Red shoes",
          payoutReference: null,
          sellerReference: "BURB123"
        }
      ],
      payoutReference: "b2cc7654-1d82-4200-97e5-20ed0e4aee45",
      sellerReference: "BURB123"
    });

    expect(res.body).toEqual({ message: "All payouts have been applied" });

    done();
  });
});
