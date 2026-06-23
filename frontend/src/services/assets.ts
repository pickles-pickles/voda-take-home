import axios from "axios";

export type AssetStatus = "ok" | "warning" | "critical";
export type AssetType = "pipe" | "hydrant" | "sensor" | "valve";

export interface AssetQueryParams {
    page: number;
    pageSize: number;

    type?: AssetType;
    status?: AssetStatus;

    lat?: number;
    lng?: number;
    radiusKm?: number;
}

export async function getAssets(
    params: AssetQueryParams
) {
    const response = await axios.get(
        "http://localhost:3000/api/assets",
        {
            params,
        }
    );

    return response.data;
}