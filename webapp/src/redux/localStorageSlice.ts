import { createSlice } from '@reduxjs/toolkit';
// import { fetchRangeFromAPI } from '../lib/influxConnection';

// import {
//     addDataToIndexedDB,
//     checkIfIndexedDBHasData,
// } from '../lib/localStorageConnection';
// import { Range } from './rangeSlice';

interface LocalStorageState {
    isLoading: boolean;
}

const initialState: LocalStorageState = {
    isLoading: true,
};

export const localStorageSlice = createSlice({
    name: 'localStorageState',
    initialState,
    reducers: {
        localStorageSuccess: (state) => {
            state.isLoading = false;
        },
    },
});

export const { localStorageSuccess } = localStorageSlice.actions;

// export const selectLoadingState = (state: RootState) =>
//     state.localStorageState.isLoading;

// export const updateLocalStorageFromAPI = (maxRange: Range): AppThunk => (
// dispatch,
// ) => {

// checkIfIndexedDBHasData()
//     .then((indexedDBHasData) => {
//         if (!indexedDBHasData) {
//             fetchRangeFromAPI(maxRange)
//                 .then((fullDataSet: any) =>
//                     addDataToIndexedDB(fullDataSet)
//                         .then((_) =>
//                             console.log('Data written to indexedDB'),
//                         )
//                         .catch((err) =>
//                             console.log(
//                                 'Error while writing to indexedDB',
//                                 err,
//                             ),
//                         )
//                         .finally(() => dispatch(localStorageSuccess())),
//                 )
//                 .catch((err: any) =>
//                     console.log('Error while fetching from API', err),
//                 );
//         } else {
//             console.log('IndexedDB is populated, not calling API');
//             dispatch(localStorageSuccess());
//         }
//     })
//     .catch(() =>
//         console.log('Error occurred while checking local DB state.'),
//     );
// };

export default localStorageSlice.reducer;
