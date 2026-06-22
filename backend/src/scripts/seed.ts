import fs from "fs/promises";
import path from "path";
import { pool } from "../config/db";


async function ensureSchemaFromFile() {
    const filePath = path.join(process.cwd(), "../db/init.sql");
    const sql = await fs.readFile(filePath, "utf-8");

    await pool.query(sql);
}


export async function seedIfEmpty() {
    console.log('test 2.5');
    console.log("checking schema...");

    await ensureSchemaFromFile();
    const result = await pool.query("SELECT COUNT(*) FROM assets");
    console.log('test 3');

    const count = Number(result.rows[0].count);
    console.log('test 4');
    if (count > 0) {
        console.log(`DB already seeded (${count} assets)`);
        return;
    }

    console.log("DB empty → seeding...");

    const file = await fs.readFile(
        path.join(process.cwd(), "data/seed.json"),
        "utf-8"
    );

    const assets = JSON.parse(file);

    for (const a of assets) {
        await pool.query(
            `
      INSERT INTO assets (
        id, name, type, status,
        lat, lng,
        installed_at,
        last_inspected_at,
        notes
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
      `,
            [
                a.id,
                a.name,
                a.type,
                a.status,
                a.lat,
                a.lng,
                a.installed_at,
                a.last_inspected_at,
                a.notes,
            ]
        );
    }

    console.log(`Seeded ${assets.length} assets`);
}