import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import statsReducer from './statsSlice';
import trendReducer from './trendSlice';
import rangeReducer from './rangeSlice';
// import localStorageReducer from './localStorageSlice';

// import { middleware as reduxPackMiddleware } from 'redux-pack';

export const store = configureStore({
    reducer: {
        stats: statsReducer,
        trend: trendReducer,
        range: rangeReducer,
        // localStorageState: localStorageReducer,
    },
    middleware: (getDefaultMiddleware) => [
        // reduxPackMiddleware,
        ...getDefaultMiddleware(),
    ],
});

export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>;
