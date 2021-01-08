import express from 'express';
import { InfluxDB, IResults, INanoDate } from 'influx';
import cors from 'cors';

const host = process.env.NODE_ENV === 'production' ? 'influxdb' : 'localhost';

const influx = new InfluxDB({
    host: host,
    database: 'power',
    port: 8086,
    schema: [
        {
            measurement: 'data',
            tags: [
                'USAGE_KWH',
                'DAY_OF_WEEK',
                'HOUR_OF_DAY',
                'VISIBILITY',
                'TEMP_F',
                'TEMP_C',
                'RELATIVE_HUMIDITY',
            ],
            fields: {},
        },
    ],
});

const HTTP_SERVER_ERROR_CODE = 500;

const app = express();
app.use(cors());
const port = 4000;

const mapToLabelAndDateFromResults = (
    result: IResults<any>,
): ReadonlyArray<readonly string[]> =>
    result.map(
        (
            line: ReadonlyArray<{ readonly time: INanoDate }>,
        ): readonly string[] => {
            const firstIdx = 0; //what the heck no-magic-numbers?
            const data = line[firstIdx];
            const name = Object.keys(data).filter(
                (key: string) => key !== 'time',
            )[firstIdx];
            const date: string = line[firstIdx].time.toNanoISOString();
            return [name, date];
        },
    );

app.get('/', (req, res) => res.send('hello world. from root'));

app.get('/range/', (req, res) => {
    console.log('fetching range');
    influx
        .query(
            'SELECT last(USAGE_KWH), time FROM data; SELECT first(USAGE_KWH), time FROM data',
        )
        .then(mapToLabelAndDateFromResults)
        .then(Object.fromEntries)
        .then(JSON.stringify)
        .then((result) => res.send(result))
        .catch(() => res.sendStatus(HTTP_SERVER_ERROR_CODE));
});

app.get('/usage-sampled-range/:start/:end/:rate/', (req, res) => {
    const [start, end, rate] = [
        req.params.start,
        req.params.end,
        req.params.rate,
    ];

    influx
        .query(
            `select min(USAGE_KWH), max(USAGE_KWH), mean(USAGE_KWH) from data where time>= '${start}' and time<= '${end}' GROUP BY time(${rate})`,
        )
        .then((result) => res.send(result))
        .catch(() => res.sendStatus(HTTP_SERVER_ERROR_CODE));
});

app.get('/stats/:start/:end/', (req, res) => {
    const [start, end] = [req.params.start, req.params.end];

    influx
        .query(
            `select min(USAGE_KWH), max(USAGE_KWH), mean(USAGE_KWH) from data where time> '${start}' and time< '${end}'`,
        )
        .then((res) => res[0])
        .then((result) => res.send(result))
        .catch(() => res.sendStatus(HTTP_SERVER_ERROR_CODE));
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
