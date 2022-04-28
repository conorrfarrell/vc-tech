import cors from 'cors';
import express from 'express';
import payout from './payouts';
import init from './init';
import errorHandler from '../middlewares/error';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/init', init);
app.use('/payouts', payout);

app.use(errorHandler);

app.listen(8080, () => console.log(`Server running on port 8080`));

export default app;
