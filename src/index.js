import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {BrowserRouter as Router} from "react-router-dom";
import AppRouter from './router/router';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(
    <Router>
      <AppRouter/>
    </Router>, document.getElementById('root')
    );

registerServiceWorker();
