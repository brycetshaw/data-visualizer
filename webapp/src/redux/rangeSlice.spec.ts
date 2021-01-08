import rangeReducer, {
    setRange,
    setMaxRange,
    Range,
    RangeState,
} from './rangeSlice';

describe('range reducer', () => {
    const initialEmptyState = {
        selectedRange: [undefined, undefined],
        maxRange: [undefined, undefined],
    } as RangeState;

    const testMaxRange = ([
        '2016-01-01T06:00:00.000Z',
        '2016-12-09T23:45:00.000Z',
    ] as unknown) as Range;

    it('should have an undefined state initially', () => {
        expect(rangeReducer(undefined, { type: '' })).toEqual(
            initialEmptyState,
        );
    });

    const stateWithMaxRange = rangeReducer(
        undefined,
        setMaxRange(testMaxRange),
    );

    it('Should add a max range to state', () => {
        expect(stateWithMaxRange).toEqual({
            ...initialEmptyState,
            maxRange: testMaxRange,
        });
    });

    it('Should add a selected range which does not exceed maxRange', () => {
        const input = ([
            '2016-03-01T06:00:00.000Z',
            '2016-12-29T23:45:00.000Z',
        ] as unknown) as Range;

        const expected = {
            ...stateWithMaxRange,
            selectedRange: [
                '2016-03-01T06:00:00.000Z',
                '2016-12-09T23:45:00.000Z',
            ],
        };

        expect(rangeReducer(stateWithMaxRange, setRange(input))).toEqual(
            expected,
        );
    });
});
