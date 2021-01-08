import { UsageStats } from '../redux/statsSlice';
import { Range } from '../redux/rangeSlice';
import { Measurement } from '../redux/trendSlice';
import { determineSampleRate } from '../utils';

const rootUrl =
    process.env.NODE_ENV === 'production'
        ? `${process.env.PUBLIC_URL}/rest/`
        : 'http://localhost:4444/';

export const fetchSampledMinMaxRangeFromAPI = async (
    selectRange: Range,
): Promise<{ data: Measurement[] }> => {
    if (selectRange.includes(undefined)) {
        return { data: [] };
    }
    const [start, end] = selectRange;
    const rate = determineSampleRate(selectRange);
    const res = await fetch(
        `${rootUrl}usage-sampled-range/${start}/${end}/${rate}`,
    );
    const results = await res.json();

    return {
        data: results,
    };
};

export const fetchStatsFromAPI = async (
    selectRange: Range,
): Promise<UsageStats> => {
    if (selectRange.includes(undefined)) {
        return { max: undefined, mean: undefined, min: undefined };
    }
    const [start, end] = selectRange;
    const res = await fetch(`${rootUrl}stats/${start}/${end}`);
    const data = await res.json();
    const { min, max, mean } = data;
    return { min, max, mean };
};

export const fetchMaxDateRangeFromAPI = async (): Promise<Range> => {
    const response = await fetch(`${rootUrl}range`);
    const data = await response.json();
    return [data.first, data.last];
};
