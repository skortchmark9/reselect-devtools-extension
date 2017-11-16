import React, { Component, PropTypes } from 'react';
import { Provider } from 'react-redux';
import App from './App';

// shouldn't go here
const selectorGraph = () => Promise.reject();
const checkSelector = () => Promise.reject();

export default class Root extends Component {

  static propTypes = {
    store: PropTypes.object.isRequired
  };

  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <App selectorGraph={selectorGraph} checkSelector={checkSelector} />
      </Provider>
    );
  }
}
