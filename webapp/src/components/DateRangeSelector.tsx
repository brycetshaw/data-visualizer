import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectMaxRange,
    selectSelectedRange,
    setRange,
} from '../redux/rangeSlice';
import { toDayjs } from '../utils';

// workaround to replace moment.js with day.js
// (https://ant.design/docs/react/replace-moment)
import dayjs, { Dayjs } from 'dayjs';
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs';
import generatePicker from 'antd/es/date-picker/generatePicker';
import 'antd/es/date-picker/style/index';
const DatePicker = generatePicker<Dayjs>(dayjsGenerateConfig);
const { RangePicker } = DatePicker;
// Weird hack ends.

const DateRangeSelector = (): JSX.Element => {
    const maxRange = useSelector(selectMaxRange);
    const selectedRange = useSelector(selectSelectedRange);
    const dispatch = useDispatch();

    const dateIsDisabled = (date: Dayjs): boolean => {
        if ([...maxRange].includes(undefined)) return false;

        const [start, end] = toDayjs(maxRange);
        return (date && date < start) || date > end;
    };

    const handleChange = (e: any) => {
        const updatedRange = e.map((d: any) => dayjs(d).toISOString());
        dispatch(setRange(updatedRange));
    };

    return (
        <RangePicker
            value={toDayjs(selectedRange)}
            onChange={handleChange}
            disabledDate={dateIsDisabled}
        />
    );
};

export default DateRangeSelector;
