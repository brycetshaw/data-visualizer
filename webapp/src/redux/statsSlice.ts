import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AppThunk, RootState } from './store';
import { fetchStatsFromAPI } from '../lib/influxConnection';
import { generateId, getFirstResolvedPromise } from '../utils';

// import { fetchStatsFromIndexedDB } from '../lib/localStorageConnection';
import { Range } from './rangeSlice';

export interface UsageStats {
    min: number | undefined;
    mean: number | undefined;
    max: number | undefined;
    updateId?: string | null;
}

const initialState: UsageStats = {
    min: undefined,
    max: undefined,
    mean: undefined,
    updateId: null,
};

export const statsSlice = createSlice({
    name: 'stats',
    initialState,
    reducers: {
        setStats: (
            state,
            action: PayloadAction<{ updateId: string } & UsageStats>,
        ) => {
            if (action.payload.updateId === state.updateId) {
                return { ...action.payload, updateId: null };
            } else {
                console.log('Promise response to update stats ignored.');
            }
        },
        setUpdateId: (state, action) => {
            state.updateId = action.payload;
        },
    },
});

export const { setStats, setUpdateId } = statsSlice.actions;

export const selectStats = (state: RootState) => {
    const { min, mean, max } = { ...state.stats };
    return { min, mean, max };
};

export const updateStats = (range: Range): AppThunk => (dispatch) => {
    const dataSources = [
        // fetchStatsFromIndexedDB,
        fetchStatsFromAPI,
    ];

    const requestId = generateId();
    dispatch(setUpdateId(requestId));

    getFirstResolvedPromise(dataSources, range).then((res) =>
        dispatch(setStats({ ...res, updateId: requestId })),
    );
};

export default statsSlice.reducer;
