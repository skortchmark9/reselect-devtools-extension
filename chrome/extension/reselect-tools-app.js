import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import './reselect-tools-app.css';

const createStore = require('../../app/store/configureStore');


// import { selectorGraph, checkSelector } from './page-api';

const initialState = {};

ReactDOM.render(
  <Root store={createStore(initialState)} />,
  document.querySelector('#root')
);
