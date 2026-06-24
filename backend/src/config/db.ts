import pkg from "pg";
import dotenv from "dotenv";

dotenv.config({
  path: process.env.NODE_ENV === "production"
    ? ".env.prod"
    : ".env.dev",
});

const { Pool } = pkg;

const required = [
  "POSTGRES_USER",
  "POSTGRES_PASSWORD",
  "POSTGRES_HOST",
  "POSTGRES_PORT",
  "POSTGRES_DB",
] as const;

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(`${key} is not defined`);
  }
}

console.log("Connected to POSTGRES db");

export const pool = new Pool({
  user: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  host: process.env.POSTGRES_HOST!,
  port: Number(process.env.POSTGRES_PORT!),
  database: process.env.POSTGRES_DB!,
});