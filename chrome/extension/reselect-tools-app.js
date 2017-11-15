import React from 'react';
import ReactDOM from 'react-dom';
import App from '../../app/containers/App';
import './reselect-tools-app.css';

import { selectorGraph, checkSelector } from './page-api';


ReactDOM.render(
  <App selectorGraph={selectorGraph} checkSelector={checkSelector} />,
  document.querySelector('#root')
);
