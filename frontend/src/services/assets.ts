import axios from "axios";
import type { Asset } from "../store/assetsSlice";

export type AssetStatus = "ok" | "warning" | "critical";
export type AssetType = "pipe" | "hydrant" | "sensor" | "valve";

export interface AssetQueryParams {
    page: number;
    pageSize: number;

    type?: string;
    status?: string;

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

export type CreateAssetPayload = Omit<Asset, "id">;

export async function postAsset(payload: CreateAssetPayload): Promise<Asset> {
    const response = await axios.post("http://localhost:3000/api/assets", payload);
    return response.data;
}