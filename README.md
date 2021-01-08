# Data Explorer

This project serves and displayes timeseries data. 

This project is built using react for frontend view, redux 
For state management. 

Backend uses influxDB timeseries database with an express.js rest API.


The app used to keep a local data cache in indexedDB. This capability is depricated but the code was interesting so it's still in there.   

## Running the App
This app can be run in production mode (simulated) by running, and then navigating to http://localhost:8080:
```
docker-compose --file docker-compose-dev.yml up --build -d 
```

It can also be run in development mode by first running the above build command (to start the database, backend), 
running the following and navigating to http://localhost:3000:
```
cd webapp 
npm install 
npm run start

```

## Deployment
App was deployed to a multi-container Elastic Beanstalk Environment, continuously deployed using AWS Code pipeline + Elastic Container Registry. None of these resources exist anymore because they cost money. 
