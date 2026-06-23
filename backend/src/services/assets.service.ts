import { pool } from "../config/db";
import { haversineDistanceKm } from "../helpers/geo";

interface AssetFilters {
    page?: number;
    pageSize?: number;
    type?: string;
    status?: string;

    lat?: number;
    lng?: number;
    radiusKm?: number;
}

export async function getAssets(
    filters: AssetFilters
) {
    const {
        page = 1,
        pageSize = 20,

        type,
        status,

        lat,
        lng,
        radiusKm,
    } = filters;

    const values: unknown[] = [];
    const where: string[] = [];

    if (type) {
        values.push(type);
        where.push(`type = $${values.length}`);
    }

    if (status) {
        values.push(status);
        where.push(`status = $${values.length}`);
    }

    let query = `
        SELECT *
        FROM assets
    `;

    if (where.length) {
        query += ` WHERE ${where.join(" AND ")}`;
    }

    const result = await pool.query(query, values);

    let assets = result.rows;

    const hasGeoFilter =
        lat !== undefined &&
        lng !== undefined &&
        radiusKm !== undefined;

    if (hasGeoFilter) {
        assets = assets.filter((asset) => {
            const distance = haversineDistanceKm(
                lat,
                lng,
                asset.lat,
                asset.lng
            );

            return distance <= radiusKm;
        });
    }

    const total = assets.length;

    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
        data: assets.slice(start, end),
        pagination: {
            page,
            pageSize,
            total,
        },
    };
}

export async function getAssetById(id: string) {
    const result = await pool.query(
        `SELECT * FROM assets WHERE id = $1`,
        [id]
    );

    return result.rows[0] ?? null;
}

export async function createAsset(asset: any) {
    const result = await pool.query(
        `
    INSERT INTO assets (
      id,
      name,
      type,
      status,
      lat,
      lng,
      installed_at,
      last_inspected_at,
      notes
    )
    VALUES (
      gen_random_uuid(),
      $1,$2,$3,$4,$5,$6,$7,$8
    )
    RETURNING *
    `,
        [
            asset.name,
            asset.type,
            asset.status,
            asset.lat,
            asset.lng,
            asset.installed_at,
            asset.last_inspected_at,
            asset.notes,
        ]
    );

    return result.rows[0];
}

export async function updateAsset(
    id: string,
    asset: any
) {
    const result = await pool.query(
        `
    UPDATE assets
    SET
      name = $1,
      type = $2,
      status = $3,
      lat = $4,
      lng = $5,
      installed_at = $6,
      last_inspected_at = $7,
      notes = $8
    WHERE id = $9
    RETURNING *
    `,
        [
            asset.name,
            asset.type,
            asset.status,
            asset.lat,
            asset.lng,
            asset.installed_at,
            asset.last_inspected_at,
            asset.notes,
            id,
        ]
    );

    return result.rows[0] ?? null;
}

export async function deleteAsset(id: string) {
    const result = await pool.query(
        `
    DELETE FROM assets
    WHERE id = $1
    RETURNING *
    `,
        [id]
    );

    return result.rows[0] ?? null;
}