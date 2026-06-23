// store/filtersSlice.ts
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

export type AssetStatus = "ok" | "warning" | "critical" | "";
export type AssetType = "pipe" | "hydrant" | "sensor" | "valve" | "";

export interface FiltersState {
    type: AssetType;
    status: AssetStatus;
    lat?: number;
    lng?: number;
    radiusKm?: number;
}

const initialState: FiltersState = {
    type: "",
    status: "",
    lat: undefined,
    lng: undefined,
    radiusKm: undefined,
};

const filtersSlice = createSlice({
    name: "filters",
    initialState,
    reducers: {
        setFilters: (_, action: PayloadAction<FiltersState>) => {
            return action.payload;
        },
        resetFilters: () => initialState,
    },
});

export const { setFilters, resetFilters } = filtersSlice.actions;
export default filtersSlice.reducer;

export const typeSelector = (state: RootState) => state.filters.type
export const statusSelector = (state: RootState) => state.filters.status
export const latSelector = (state: RootState) => state.filters.lat
export const lngSelector = (state: RootState) => state.filters.lng
export const radiusKmSelector = (state: RootState) => state.filters.radiusKm