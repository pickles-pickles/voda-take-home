import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

/* export type AssetStatus = "ok" | "warning" | "critical";
export type AssetType = "pipe" | "hydrant" | "sensor" | "valve"; */

export interface Asset {
    id: string;
    name: string;
    type: string;
    status: string;
    lat: number;
    lng: number;
    installed_at: string;
    last_inspected_at: string | null;
    notes: string | null;
}

export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

interface AssetsState {
    items: Asset[];
    pagination: Pagination;
    loading: boolean;
    error: string | null;
    selectedAsset: Asset | null;
}

const initialState: AssetsState = {
    items: [],
    pagination: {
        page: 1,
        pageSize: 20,
        total: 0,
    },
    loading: false,
    error: null,
    selectedAsset: null
};

const assetsSlice = createSlice({
    name: "assets",
    initialState,
    reducers: {
        setAssets(state, action: PayloadAction<Asset[]>) {
            state.items = action.payload;
        },
        setSelectedAsset(state, action: PayloadAction<Asset>) {
            state.selectedAsset = action.payload;
        },
        setPagination(state, action: PayloadAction<Pagination>) {
            state.pagination = action.payload;
        },

        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },

        setError(state, action: PayloadAction<string | null>) {
            state.error = action.payload;
        },

        resetAssets() {
            return initialState;
        },
    },
});

export const {
    setAssets,
    setSelectedAsset,
    setPagination,
    setLoading,
    setError,
    resetAssets,
} = assetsSlice.actions;

export default assetsSlice.reducer;

export const paginationSelector = (state: RootState) => state.assets.pagination

export const assetsSelector = (state: RootState) => state.assets.items

export const selectedAssetSelector = (state: RootState) => state.assets.selectedAsset