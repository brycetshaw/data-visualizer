import React, { useEffect, useMemo, useState } from 'react';
import {
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    ReferenceArea,
    ResponsiveContainer,
    Area,
    ComposedChart,
} from 'recharts';

import { useDispatch, useSelector } from 'react-redux';
import { Range, selectSelectedRange, setRange } from '../redux/rangeSlice';

import { Measurement, selectTrend } from '../redux/trendSlice';

import { arrayBetweenDates, statsFromArray } from '../utils';
import dayjs from 'dayjs';

const initialRefState = {
    refAreaLeft: '',
    refAreaRight: '',
};

const UsageChart = (): JSX.Element => {
    const [refArea, setRefArea] = useState(initialRefState);
    const rawData = useSelector(selectTrend);
    const data = useMemo(
        () =>
            rawData.map(
                (val): Measurement => ({
                    ...val,
                    time: dayjs(val.time).valueOf(),
                }),
            ),
        [rawData],
    );

    const selectedRange = useSelector(selectSelectedRange);
    const dispatch = useDispatch();
    let { refAreaLeft, refAreaRight } = refArea;

    useEffect(() => {
        setRefArea(initialRefState);
    }, [data]);

    const highlightedStats = useMemo(() => {
        const highlightedData = arrayBetweenDates(
            data,
            refAreaRight,
            refAreaLeft,
        );

        return statsFromArray(highlightedData);
    }, [refAreaRight, refAreaLeft, data]);

    const zoom = () => {
        if (refAreaLeft === refAreaRight || refAreaRight === '') {
            setRefArea(initialRefState);
            return;
        }

        // xAxis domain
        if (refAreaLeft > refAreaRight)
            [refAreaLeft, refAreaRight] = [refAreaRight, refAreaLeft];

        const newSelection: Range = ([
            dayjs(refAreaLeft).toISOString(),
            dayjs(refAreaRight).toISOString(),
        ] as unknown) as Range;

        setRefArea(initialRefState);
        dispatch(setRange(newSelection));
    };

    const [left, right] = selectedRange.map((d) => dayjs(d).valueOf());

    return (
        <ResponsiveContainer width="97%" height="97%">
            <ComposedChart
                data={data.map((val) => ({
                    ...val,
                    span: val.min !== val.max ? [val.min, val.max] : [],
                }))}
                onMouseLeave={() => setRefArea(initialRefState)}
                onMouseDown={(e) => {
                    if (e === null) {
                        setRefArea(initialRefState);
                        return;
                    }
                    setRefArea({
                        refAreaLeft: e.activeLabel,
                        refAreaRight: '',
                    });
                }}
                onMouseMove={(e) => {
                    if (e === null) {
                        setRefArea(initialRefState);
                        return;
                    }
                    refAreaLeft &&
                        setRefArea({
                            ...refArea,
                            refAreaRight: e.activeLabel,
                        });
                }}
                onMouseUp={zoom}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    allowDataOverflow={true}
                    dataKey="time"
                    domain={[left, right]}
                    tickFormatter={() => ''}
                    scale="time"
                    type="number"
                />
                <YAxis />
                <Tooltip
                    labelFormatter={(t) =>
                        dayjs(t).format('MMM D, YYYY h:mm A')
                    }
                    formatter={(value, name) => [
                        Array.isArray(value)
                            ? [
                                  value
                                      .map((val) => (+val).toFixed(2))
                                      .join(' kWh to '),
                                  value.length === 2 ? ' kWh' : '',
                              ].join('')
                            : (+value).toFixed(2) + ' kWh',
                        value.toString() !== '' ? name : '',
                    ]}
                />
                <Area
                    dataKey={'span'}
                    stroke="#8884d8"
                    fill="#8884d8"
                    isAnimationActive={false}
                />
                <Line
                    type="natural"
                    dataKey={'mean'}
                    stroke="#3A395B"
                    dot={false}
                    isAnimationActive={false}
                />
                {refAreaLeft && refAreaRight ? (
                    <ReferenceArea
                        x1={refAreaLeft}
                        x2={refAreaRight}
                        strokeOpacity={0.3}
                        label={Object.entries(highlightedStats)
                            .map(
                                ([key, value]) =>
                                    `${key}: ${
                                        (value as number).toFixed(2) || 'N/A'
                                    }`,
                            )
                            .join('\n')}
                    />
                ) : null}
            </ComposedChart>
        </ResponsiveContainer>
    );
};

export default UsageChart;
