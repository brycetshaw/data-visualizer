import React, { useEffect } from 'react';
import { Layout } from 'antd';
import { grey } from '@ant-design/colors';

import { useDispatch, useSelector } from 'react-redux';
import {
    selectMaxRange,
    selectSelectedRange,
    setRange,
    updateMaxRange,
} from './redux/rangeSlice';

import { selectStats, updateStats } from './redux/statsSlice';

import { updateTrend } from './redux/trendSlice';

// import { updateLocalStorageFromAPI } from './redux/localStorageSlice';

import DateRangeSelector from './components/DateRangeSelector';

import UsageChart from './components/UsageChart';
import ZoomOutButton from './components/ZoomOutButton';
import StatsBox from './components/StatsBox';

const { Header, Content } = Layout;

const GREY_IDX = 0;

const App: React.FC = () => {
    const { min, mean, max } = useSelector(selectStats);
    const maxRange = useSelector(selectMaxRange);
    const selectedRange = useSelector(selectSelectedRange);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(updateMaxRange());
    }, [dispatch]);

    useEffect(() => {
        if (selectedRange.includes(undefined)) return;
        dispatch(updateStats(selectedRange));
        dispatch(updateTrend(selectedRange));
    }, [selectedRange, dispatch]);

    useEffect(() => {
        if (maxRange.includes(undefined)) return;
        // dispatch(updateLocalStorageFromAPI(maxRange));
        dispatch(setRange(maxRange));
    }, [maxRange, dispatch]);

    return (
        <Layout className="layout" style={{ overflow: 'hidden' }}>
            <Header
                style={{ display: 'flex', justifyContent: 'space-between' }}
            >
                <h1 style={{ color: grey[GREY_IDX] }}>Data Visualizer</h1>
                <StatsBox title={'Minimum'} value={min} />
                <StatsBox title={'Mean'} value={mean} />
                <StatsBox title={'Maximum'} value={max} />
            </Header>
            <Content
                draggable={false}
                unselectable={'on'}
                onDragStart={(e) => e.preventDefault()}
                onDrag={(e) => e.preventDefault()}
                style={{
                    height: 'calc(100vh - 70px)',
                    width: '100vw',
                    userSelect: 'none',
                }}
            >
                <DateRangeSelector />
                <ZoomOutButton />
                <UsageChart />
            </Content>
        </Layout>
    );
};

export default App;
