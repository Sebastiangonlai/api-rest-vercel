import express from 'express';
import mysql from "mysql2/promise";

const router = express.Router();

type EmojiResponse = string[];


router.get<{}, EmojiResponse>('/', async (req, res) => {
  let connectiosn = mysql.createConnection({
       host: process.env.DB_HOST,
       user: process.env.DB_USER,
       password: process.env.DB_PASS,
       database: process.env.DB_NAME,
     });


  const rows = await (await connectiosn).execute("SELECT * FROM ranking");
  // console.log("🚀 ~ file: emojis.ts ~ line 50 ~ router.get ~ rows", rows)
  rows.forEach((row: any) => {
    res.json(row);
  });
  // res.json(['😀', '😳', '🙄']);
});

export default router;
