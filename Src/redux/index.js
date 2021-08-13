import {createStore, applyMiddleware} from 'redux';
import allReducers from './reducers';
import thunk from 'redux-thunk';

let store = createStore(allReducers, applyMiddleware(thunk));

export default function getStore() {
  return store;
}
