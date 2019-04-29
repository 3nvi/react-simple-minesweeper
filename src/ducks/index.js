import { combineReducers } from 'redux';
import gameReducer, { REDUX_STATE_KEY } from './game';

export default combineReducers({
  [REDUX_STATE_KEY]: gameReducer,
});
