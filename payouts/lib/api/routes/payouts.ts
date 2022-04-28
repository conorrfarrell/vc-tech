import * as dotenv from "dotenv";
import express from 'express';
import type { Response, Request, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { BasicItem, Item } from '../../types/item';
import * as itemModel from "../../db/models/item";
import * as sellerModel from "../../db/models/seller";
import * as payoutModel from "../../db/models/payout";
import totalAmount from '../../utils/totalAmount';
import bodySchema from '../../validation/schemas/body';
import validate from '../../validation/validate';

const router = express.Router();

dotenv.config();

// Get all payouts by seller reference
router.get('/:sellerReference', async (req: Request, res: Response, next: NextFunction) => {
  // The Payouts must be persisted in a database, and can be exposed through an API.
  try {
    await sellerModel.findOne(req.params.sellerReference);

    return res.json(await payoutModel.findAll(req.params.sellerReference));
  } catch (err) {
    return next(err);
  }
});

// Get all sold items not yet in payout
router.get('/:sellerReference/pending', async (req: Request, res: Response, next: NextFunction) => {
  // The Payouts must be persisted in a database, and can be exposed through an API.
  try {
    await sellerModel.findOne(req.params.sellerReference);

    return res.json({ soldItems: await itemModel.findAll(req.params.sellerReference)});
  } catch (err) {
    return next(err);
  }
});

// API call that accepts a list of sold Items and creates Payouts for the sellers
router.post('/:sellerReference', validate(bodySchema, 'body'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get all seller information
    const { PAYOUT_TRANSACTION_LIMIT } = process.env;
    let payouts: Array<Array<Item>> = [];
    let tempPayout: Array<Item> = [];
    let tempPayoutCounter: number = 0;

    const sellerInfo = await sellerModel.findOne(req.params.sellerReference);

    // Get all sold items based on the items supplied to the call
    const itemIds: Array<BasicItem> = req.body.soldItems;
    let items = await Promise.all(itemIds.map(async (itemId) => {
      const item = await itemModel.findOne(itemId, sellerInfo);
      return item;
    }));

    // sort to minimise the amount of payouts
    await items.sort((a, b) => Number(a.amount) - Number(b.amount));

    // Go through each item and split into separate payouts depending on the value
    // If it exceed put in its own payout
    // If multiple can fit before exceeding put those in a payout
    items.map((item) => {
      if (item.amount > parseInt(PAYOUT_TRANSACTION_LIMIT)) return payouts.push([item]);

      tempPayoutCounter += item.amount;
      if (tempPayoutCounter < parseInt(PAYOUT_TRANSACTION_LIMIT)) tempPayout.push(item);
      if (tempPayoutCounter > parseInt(PAYOUT_TRANSACTION_LIMIT)) {
        payouts.push(tempPayout);
        tempPayoutCounter = 0;
        tempPayout = [item];
      }
    })

    // Any outstanding can be singularly pushed
    if (tempPayout[0]) payouts.push(tempPayout);

    // Create payouts
    payouts.map(async (payout: Array<Item>) => {
      const payoutReference = uuidv4()
      await payoutModel.create({
        payoutReference,
        sellerReference: sellerInfo.sellerReference,
        amount: totalAmount(payout), // Needs to include decimals but above needs to only go to two decimal places
        currency: sellerInfo.currency,
        items: payout,
      });

      // Update Item so it has a payout reference as an indicator
      await payout.map((item: Item) => itemModel.update(item.itemId, payoutReference))
    })

    // State all is complete
    return res.json({ message: "All payouts have been applied" });
  } catch (err) {
    return next(err);
  }
});

export default router;
