import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./store";

interface ModalState {
    isModalOpen: boolean;
    isCreationModalOpen: boolean;
}

const initialState: ModalState = {
    isModalOpen: false,
    isCreationModalOpen: false,
    /*     loading: false,
        error: null,
        selectedAsset: null */
};

const appSlice = createSlice({
    name: "app",
    initialState,
    reducers: {
        setIsModalOpen(state, action: PayloadAction<boolean>) {
            state.isModalOpen = action.payload;
        },
        setIsCreationModalOpen(state, action: PayloadAction<boolean>) {
            state.isCreationModalOpen = action.payload;
        },

    },
});

export const {
    setIsModalOpen,
    setIsCreationModalOpen
} = appSlice.actions;

export default appSlice.reducer;

export const isModalOpenSelector = (state: RootState) => state.app.isModalOpen
export const isCreationModalOpenSelector = (state: RootState) => state.app.isCreationModalOpen