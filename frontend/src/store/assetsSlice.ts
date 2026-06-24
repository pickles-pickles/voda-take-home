import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { postAsset } from "../services/assets";

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

export type CreateAssetPayload = Omit<Asset, "id">;

export const createAssetThunk = createAsyncThunk<
    Asset,
    CreateAssetPayload,
    { rejectValue: string }
>(
    "assets/createAsset",
    async (payload, thunkApi) => {
        try {
            const createdAsset = await postAsset(payload);
            return createdAsset;
        } catch (error: unknown) {
            let message = "Failed to create asset";

            if (
                typeof error === "object" &&
                error !== null &&
                "response" in error
            ) {
                const axiosError = error as {
                    response?: { data?: { message?: string } };
                    message?: string;
                };

                message =
                    axiosError.response?.data?.message ??
                    axiosError.message ??
                    message;
            }

            return thunkApi.rejectWithValue(message);
        }
    }
);

const assetsSlice = createSlice({
    name: "assets",
    initialState,
    reducers: {
        setAssets(state, action: PayloadAction<Asset[]>) {
            state.items = action.payload;
        },
        setSelectedAsset(state, action: PayloadAction<Asset | null>) {
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
        addAsset(state, action: PayloadAction<Asset>) {
            state.items.unshift(action.payload);
            state.pagination.total += 1;
        },
        resetAssets() {
            return initialState;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createAssetThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAssetThunk.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.items.unshift(action.payload);
                state.pagination.total += 1;
            })
            .addCase(createAssetThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload ?? "Failed to create asset";
            });
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

export const errorSelector = (state: RootState) => state.assets.error

export const isLoadingSelector = (state: RootState) => state.assets.loading