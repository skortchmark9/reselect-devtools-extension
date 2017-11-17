import React from 'react';
import ReactDOM from 'react-dom';
import Root from '../../app/containers/Root';
import './reselect-tools-app.css';

import * as api from './page-api';

import createStore from '../../app/store/configureStore';
import createApiMiddleware from '../../app/utils/apiMiddleware';

const mockApi = {
  checkSelector: (id) => Promise.resolve({ inputs: [], output: 2, id, name: id }),
  selectorGraph: () => {
    const a = { id: 'a', recomputations: 10, isRegistered: true };
    const b = { id: 'b', recomputations: 10, isRegistered: true };
    return Promise.resolve({ nodes: { a, b }, edges: [{ from: 'a', to: 'b' }] });
  },
};


const apiMiddleware = createApiMiddleware(api);
// const apiMiddleware = createApiMiddleware(window.location.origin === 'http://localhost:8000' ? mockApi : api);


const initialState = {};

ReactDOM.render(
  <Root store={createStore(initialState, apiMiddleware)} />,
  document.querySelector('#root')
);
