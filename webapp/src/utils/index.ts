import { Range } from '../redux/rangeSlice';
import dayjs, { Dayjs } from 'dayjs';

import isBetween from 'dayjs/plugin/isBetween';
import { Measurement } from '../redux/trendSlice';
dayjs.extend(isBetween);

type DayjsRange = [Dayjs, Dayjs] | undefined;

/**
 * Helper function to parse ISO date string [start, end] pairs to dayjs
 */
export const toDayjs = (range: Range): DayjsRange => {
    if (range.includes(undefined)) {
        return undefined;
    } else {
        return range.map(dayjs) as DayjsRange;
    }
};

/**
 * Transforms Range to be larger, but does not exceed the limit Range.
 * @param original
 * @param limits
 * @param expandBy
 */
export const expandWindow = (
    original: Range,
    limits: Range,
    expandBy: number,
): Range => {
    const [start, end]: Dayjs[] = toDayjs(original) as Dayjs[];
    const [min, max]: Dayjs[] = toDayjs(limits) as Dayjs[];
    const window = end.diff(start);

    const calculateExpandedRange = () => [
        start.subtract(expandBy * window),
        end.add(window * expandBy),
    ];

    const calculateBoundedRange = ([expandedStart, expandedEnd]: Dayjs[]) => [
        expandedStart.isBefore(min) ? min : expandedStart,
        expandedEnd.isAfter(max) ? max : expandedEnd,
    ];
    const toISOString = (val: Dayjs) => val.toISOString();

    return calculateBoundedRange(calculateExpandedRange()).map(
        toISOString,
    ) as Range;
};

export const isSameRange = (a: Range, b: Range): boolean | undefined => {
    const mapToValue = (a: Range) => a.map((d) => dayjs(d).valueOf());
    return mapToValue(a).join() === mapToValue(b).join();
};

/**
 * This is a checker to make sure that the next state of the range is valid,
 * if it isn't, it will return an appropriate range.
 *
 * @param current
 * @param next
 * @param limit
 */
export const isValidRange = (current: Range, next: Range, limit: Range) => {
    const nextRange = toDayjs(next);
    if (nextRange === undefined) return current;
    const [start, end] = nextRange;
    if (start && end && start < end) {
        if (end.diff(start) < 1000000) {
            return expandWindow(next, limit, 5);
        }
        return expandWindow(next, limit, 0);
    } else {
        return expandWindow(next.reverse() as Range, limit, 0);
    }
};

/**
 * Formats a number to a specified number of digits. So that it looks pretty.
 * @param num
 * @param digits
 */
export const roundTo = (num: number | undefined, digits: number) => {
    if (num === undefined) return;
    const tens = Math.pow(10, digits);
    return Math.round(num * tens) / tens;
};

/**
 * This returns a frequency (in minutes) required to keep the number of data points <500 for time range.
 * To a minimum of 15 minute interval.
 * @param selectRange
 */
export const determineSampleRate = (selectRange: Range): string => {
    const [start, end] = toDayjs(selectRange);
    const diff = end.diff(start, 'minute');
    const calculatedRate = Math.ceil(diff / 500);
    const minRate = 15;
    const rate = Math.max(calculatedRate, minRate);
    return `${rate}m`;
};

/**
 * Accepts an array of async functions, followed by the arguments they expect.
 * The first promise to resolve is returned.
 * @param asyncFunctionsArray
 * @param arg
 */
export const getFirstResolvedPromise = async <T, A>(
    asyncFunctionsArray: Array<(arg: A) => Promise<T>>,
    arg: A = ([] as unknown) as A,
): Promise<T> => {
    return Promise.any(
        asyncFunctionsArray.map((asyncFunction) => asyncFunction(arg)),
    );
};

export const generateId = (length = 6) => {
    return Math.random().toString(20).substr(2, length);
};

export const arrayBetweenDates = (
    data: Measurement[],
    lowerBound: string,
    upperBound: string,
) => {
    return data.filter((val) =>
        dayjs(val.time).isBetween(lowerBound, upperBound),
    );
};

export const statsFromArray = (array: Measurement[]) => {
    if (array.length === 0) return {};
    return {
        min: Math.min(...array.map((val) => val.min)),
        max: Math.max(...array.map((val) => val.max)),
        mean: array.reduce((sum, val) => sum + val.mean, 0) / array.length,
    };
};
