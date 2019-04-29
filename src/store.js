import { createStore as createReduxStore, applyMiddleware, compose } from 'redux';
import { handleConstructGrid, handleOpenCell, handleRepeatGame } from 'middlewares';
import rootReducer from './ducks';

let composeEnhancers;
if (process.env.NODE_ENV === 'development') {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
} else {
  composeEnhancers = compose;
}

// we export them in order to be used in our test utils
export const storeMiddlewares = [handleConstructGrid, handleOpenCell, handleRepeatGame];

// a Generic function that returns a new store configured with the reducers & middlewares of the app
export const createStore = (initialState = {}) =>
  createReduxStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...storeMiddlewares))
  );

export default createStore();
