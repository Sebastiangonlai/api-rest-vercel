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

let conn;

app.get<{}, MessageResponse>('/', (req, res) => {
  mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  }).then(connection => {
    conn = connection;
    return conn.execute("SELECT rank, score, name FROM ranking");
  }).then((rows) => {
    // res.json(rows);
  }).catch((err) => {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  });
});



app.use('/api/v1', api);

app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

export default app;
