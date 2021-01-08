import { expandWindow, isSameRange } from '../utils';
import {
    selectMaxRange,
    selectSelectedRange,
    setRange,
} from '../redux/rangeSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from 'antd';
import React from 'react';

const ZoomOutButton = () => {
    const selectedRange = useSelector(selectSelectedRange);
    const maxRange = useSelector(selectMaxRange);
    const dispatch = useDispatch();

    const zoomOut = (e: any) => {
        e.preventDefault();
        const newRange = expandWindow(selectedRange, maxRange, 0.1);
        dispatch(setRange(newRange));
    };

    return (
        <Button
            onClick={zoomOut}
            disabled={isSameRange(selectedRange, maxRange)}
            style={{}}
        >
            Zoom out
        </Button>
    );
};

export default ZoomOutButton;
