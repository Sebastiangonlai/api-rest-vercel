import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';

import mysql from "mysql2/promise";

import * as middlewares from './middlewares';
import api from './api';
import MessageResponse from './interfaces/MessageResponse';

require('dotenv').config();

const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get<{}, MessageResponse>('/', (req, res) => {
  res.json({
    message: 'sebas',
  });
});

type EmojiResponse = string[];


app.get<{}, EmojiResponse>('/ranking', async (req, res) => {
  try {
    let connectiosn;
     connectiosn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
    let rows;
      rows=await connectiosn.execute("SELECT rank, score, name FROM ranking");
    rows.forEach((row: any) => {
      res.json(row);
    });
  } catch (error) {
 return error;
  }

});

app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
