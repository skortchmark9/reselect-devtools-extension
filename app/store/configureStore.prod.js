import { applyMiddleware, createStore, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';
import storage from '../utils/storage';


export default function (initialState, ...middlewares) {
  const middlewares = applyMiddleware(thunk, ...middlewares);
  const enhancer = compose(
    middlewares,
    storage()
  );

  return createStore(rootReducer, initialState, enhancer);
}
