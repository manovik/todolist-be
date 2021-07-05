require('dotenv').config();

import express from 'express';
import mongoose from 'mongoose';
import morgan from 'morgan';
import cors from 'cors';

import { router } from './router/router';

const PORT: string = process.env.PORT || '8080';
const mongoDB: string = process.env.MY_MONGO_DB || '';

const app = express();
app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
app.use('/todos', router);


mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.listen(PORT, () => {
  console.log('start on', PORT);
});
