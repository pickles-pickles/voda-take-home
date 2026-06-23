import axios from "axios";

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