import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from './store';
import { fetchMaxDateRangeFromAPI } from '../lib/influxConnection';
import { getFirstResolvedPromise, isValidRange } from '../utils';

// import { fetchMaxDateRangeFromIndexedDB } from '../lib/localStorageConnection';

export type Range = [string | undefined, string | undefined];

export interface Measurement {
    time: number;
    USAGE_KWH: number;
}

export interface RangeState {
    selectedRange: Range;
    maxRange: Range;
}

const initialState: RangeState = {
    selectedRange: [undefined, undefined],
    maxRange: [undefined, undefined],
};

export const rangeSlice = createSlice({
    name: 'range',
    initialState,
    reducers: {
        setMaxRange: (state, action: PayloadAction<Range>) => {
            state.maxRange = action.payload;
        },
        setRange: (state, action: PayloadAction<Range>) => {
            state.selectedRange = isValidRange(
                state.selectedRange,
                action.payload,
                state.maxRange,
            );
        },
    },
});

export const { setMaxRange, setRange } = rangeSlice.actions;

export const selectMaxRange = (state: RootState) => state.range.maxRange;

export const selectSelectedRange = (state: RootState) =>
    state.range.selectedRange;

export const updateMaxRange = (): AppThunk => (dispatch) => {
    const dataSources = [
        fetchMaxDateRangeFromAPI,
        // fetchMaxDateRangeFromIndexedDB,
    ];

    getFirstResolvedPromise(dataSources).then((res) =>
        dispatch(setMaxRange(res)),
    );
};

export default rangeSlice.reducer;
