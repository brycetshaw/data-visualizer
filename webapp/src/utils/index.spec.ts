import {
    expandWindow,
    isValidRange,
    isSameRange,
    statsFromArray,
    arrayBetweenDates,
} from './index';
import { Range } from '../redux/rangeSlice';

const testLimit = ([
    '2016-01-01T06:00:00.000Z',
    '2016-12-09T23:45:00.000Z',
] as unknown) as Range;

const testCurrent = ([
    '2016-06-06T06:06:06.000Z',
    '2016-09-09T09:09:09.000Z',
] as unknown) as Range;

describe('isValidRange', () => {
    const curriedIsValidRange = (input: Range) =>
        isValidRange(testCurrent, input, testLimit);

    it('Should return a range which does not exceed the max Range', () => {
        const input = ([
            '2016-05-01T06:00:00.000Z',
            '2016-12-22T23:45:00.000Z',
        ] as unknown) as Range;

        const expected = ([
            '2016-05-01T06:00:00.000Z',
            '2016-12-09T23:45:00.000Z',
        ] as unknown) as Range;

        expect(curriedIsValidRange(input)).toEqual(expected);
    });

    it('Should return the current range given an invalid input', () => {
        expect(curriedIsValidRange([undefined, undefined])).toEqual(
            testCurrent,
        );
    });

    it('should return the correct range, given a valid input', () => {
        const input = ([
            '2016-05-01T06:00:00.000Z',
            '2016-10-22T23:45:00.000Z',
        ] as unknown) as Range;

        expect(curriedIsValidRange(input)).toEqual(input);
    });
});

describe('ExpandWindow', () => {
    it('should expand range', () => {
        expect(expandWindow(testCurrent, testLimit, 0.1)).toEqual([
            '2016-05-27T17:47:47.700Z',
            '2016-09-18T21:27:27.300Z',
        ]);
    });

    it('should not exceed limits', () => {
        expect(expandWindow(testCurrent, testLimit, 10000)).toEqual(testLimit);
    });
});

describe('isSameRange', () => {
    it('should assert ranges are equal', () => {
        const range1 = [
            '2016-05-01T06:00:00.000000000Z',
            '2016-10-22T23:45:00.000000000Z',
        ] as Range;

        const range2 = [
            '2016-05-01T06:00:00.000Z',
            '2016-10-22T23:45:00.000Z',
        ] as Range;

        expect(isSameRange(range1, range2)).toEqual(true);
    });

    it('should assert ranges are not equal', () => {
        const range1 = [
            '2016-05-01T06:01:00.000000000Z',
            '2016-10-22T23:45:00.000000000Z',
        ] as Range;

        const range2 = [
            '2016-05-01T06:00:00.000Z',
            '2016-10-22T23:45:00.000Z',
        ] as Range;

        expect(isSameRange(range1, range2)).toEqual(false);
    });
});

describe('statsFromArray', () => {
    it('should calculate stats for array', () => {
        expect(statsFromArray([0, 0, 0, 5, 5, 5, 10, 10, 10])).toEqual({
            min: 0,
            mean: 5,
            max: 10,
        });
    });

    it('should filter array by date', () => {
        expect(
            arrayBetweenDates(
                [
                    { time: '2016-04-01T06:00:00.000Z', key: 0 },
                    { time: '2016-05-01T06:00:00.000Z', key: 1 },
                    { time: '2016-06-01T06:00:00.000Z', key: 0 },
                ],
                '2016-04-05T06:00:00.000Z',
                '2016-05-05T06:00:00.000Z',
                'key',
            ),
        ).toEqual([1]);
    });
});
