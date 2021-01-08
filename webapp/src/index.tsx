import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './redux/store';
// import * as serviceWorker from './serviceWorker';

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
if (window.Cypress) window.store = store;

ReactDOM.render(
    // <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>,
    // </React.StrictMode>,
    document.getElementById('root'),
);

// serviceWorker.register();
