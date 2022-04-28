import * as dotenv from "dotenv";
import express from 'express';
import type { Response, Request, NextFunction } from 'express';
import { init } from '../../db/connection';
const router = express.Router();

dotenv.config();

// Initialise db and tables
router.post('/', async (_: Request, res: Response, next: NextFunction) => {
  // The Payouts must be persisted in a database, and can be exposed through an API.
  try {
    await init();

    return res.json({ message: 'Tables and database created' });
  } catch (err) {
    return next(err);
  }
});

export default router;
