import { combineReducers, configureStore } from '@reduxjs/toolkit'
import filtersSlice from './filtersSlice'


export const store = configureStore({
    reducer: combineReducers({
        filters: filtersSlice,

    })
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch