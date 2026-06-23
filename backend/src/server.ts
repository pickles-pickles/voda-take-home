import express from "express";
import { seedIfEmpty } from "./scripts/seed";
import { pool } from "./config/db";
import { swaggerDocs } from "./docs/swagger";
import router from "./routes/assets.routes";
import { BASE_URL } from "./helpers/constants";

export async function createServer() {
    const app = express();

    app.use(express.json());
    console.log('test 1');
    app.use(router);
    swaggerDocs(app);

    app.get("/health", (_req, res) => {
        res.json({ status: "ok" });
    });

    /*     app.get("/assets", async (_req, res) => {
            const result = await pool.query("SELECT * FROM assets");
            res.json(result.rows);
        }); */

    await seedIfEmpty();

    return app;
}