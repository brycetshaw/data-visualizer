import { UsageStats } from '../redux/statsSlice';
import { Range } from '../redux/rangeSlice';
import { Measurement } from '../redux/trendSlice';
import Dexie from 'dexie';

const db = new Dexie('usageDB');

db.version(1).stores({
    trend: 'time,USAGE_KWH',
});

export const fetchSampledRangeFromIndexedDB = async ([
    start,
    end,
]: Range): Promise<{ data: Measurement[] }> => {
    const rangeFromIndexedDB = await db
        .table('trend')
        .where('time')
        .between(start, end)
        .toArray()
        .then((arr) => {
            const gate = Math.floor(arr.length / 500) + 1;
            return {
                data: arr.filter((_, idx) => idx % gate < 1),
            };
        });

    if (rangeFromIndexedDB.data.length === 0) return Promise.reject();

    return rangeFromIndexedDB;
};

export const checkIfIndexedDBHasData = async () => {
    const count = await db.table('trend').count();
    return count > 0;
};

export const addDataToIndexedDB = async (data: Measurement[]) => {
    if (await checkIfIndexedDBHasData()) return Promise.reject();

    // await db.table('trend').clear();
    return db.table('trend').bulkAdd(data);
};

export const fetchStatsFromIndexedDB = async (
    selectRange: Range,
): Promise<UsageStats> => {
    if (selectRange.includes(undefined)) {
        return { max: undefined, mean: undefined, min: undefined };
    }
    const [start, end] = selectRange;

    const arrayOfObjects = await db
        .table('trend')
        .where('time')
        .between(start, end)
        .toArray();

    if (arrayOfObjects.length < 1) return Promise.reject();

    const array = arrayOfObjects.map((val: Measurement): number => val.mean);

    if (array.length < 1) return Promise.reject();
    return {
        min: Math.min(...array),
        max: Math.max(...array),
        mean: array.reduce((sum, val) => sum + val, 0) / array.length,
    };
};

export const fetchMaxDateRangeFromIndexedDB = async (): Promise<Range> => {
    const start = await db.table('trend').toCollection().first();
    const end = await db.table('trend').toCollection().last();

    if ([start, end].includes(undefined)) return Promise.reject();

    return [await start, await end].map((res) => res.time) as Range;
};
