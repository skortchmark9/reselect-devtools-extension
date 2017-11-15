import React from 'react';
import ReactDOM from 'react-dom';
// import Root from '../../app/containers/Root';
import App from '../../app/containers/App';
import './todoapp.css';

import { selectorGraph, checkSelector } from './page-api';


ReactDOM.render(
  <App selectorGraph={selectorGraph} checkSelector={checkSelector} />,
  document.querySelector('#root')
);
