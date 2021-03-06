import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import CoCo from './js/CoCo.jsx';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <CoCo />,
    document.getElementById('CoCo')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
