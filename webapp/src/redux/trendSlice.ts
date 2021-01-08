import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from './store';
import { fetchSampledMinMaxRangeFromAPI } from '../lib/influxConnection';
import { generateId, getFirstResolvedPromise } from '../utils';
import { Range } from './rangeSlice';

export interface Measurement {
    time: number;
    min: number;
    max: number;
    mean: number;
}

interface TrendState {
    data: Measurement[];
    updateId?: null | string;
}

const initialState: TrendState = {
    data: [],
    updateId: null,
};

export const trendSlice = createSlice({
    name: 'trend',
    initialState,
    reducers: {
        setData: (
            state,
            action: PayloadAction<{ id: string } & TrendState>,
        ) => {
            if (action.payload.id === state.updateId) {
                state.data = action.payload.data;
                state.updateId = null;
            } else {
                console.log('Promise response to update trend ignored.');
            }
        },
        setUpdateId: (state, action) => {
            state.updateId = action.payload;
        },
    },
});

export const { setData, setUpdateId } = trendSlice.actions;

export const selectTrend = (state: RootState) => state.trend.data;

export const updateTrend = (range: Range): AppThunk => (dispatch) => {
    if (range.includes(undefined)) return;

    const dataSources = [fetchSampledMinMaxRangeFromAPI];

    const requestId = generateId();
    dispatch(setUpdateId(requestId));

    getFirstResolvedPromise(dataSources, range).then((res) =>
        dispatch(setData({ id: requestId, ...res })),
    );
};

export default trendSlice.reducer;
