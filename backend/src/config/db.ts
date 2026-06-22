import pkg from 'pg';

import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

if (!process.env.POSTGRES_DB) {
  console.log('p env', process.env);

  throw new Error("POSTGRES db is not defined");
}

console.log('Connected to POSTGRES db');



export const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  database: process.env.POSTGRES_DB,
});