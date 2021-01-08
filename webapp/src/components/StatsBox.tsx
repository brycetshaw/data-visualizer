import { Statistic, Typography } from 'antd';
import React from 'react';

interface CalcBoxProps {
    title: string;
    value: number | undefined;
}

function StatsBox({ title, value }: CalcBoxProps): React.ReactElement {
    return (
        <Statistic
            title={<Typography.Link>{title}</Typography.Link>}
            value={value?.toFixed(2) || 'N/A'}
            style={{ color: 'wheat' }}
            valueStyle={{ color: 'whitesmoke' }}
            suffix="kWh"
        />
    );
}

export default StatsBox;
