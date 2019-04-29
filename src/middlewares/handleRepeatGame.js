import { getColumnCount, REPEAT_GAME, getRowCount, getMineCount, createGame } from 'ducks/game';

const handleRepeatGame = store => next => action => {
  // Whenever the user attempts to repeat the same game, then dispatch a
  // `createGame` action with the user parameters that were already stored in
  // the store. For clarity, the `REPEAT_GAME` action is NOT handled by the reducer,
  // we only have it so we can map it to a `createGame` action
  if (action.type === REPEAT_GAME) {
    const state = store.getState();
    const rowCount = getRowCount(state);
    const columnCount = getColumnCount(state);
    const mineCount = getMineCount(state);

    store.dispatch(createGame({ rowCount, columnCount, mineCount }));
  }

  next(action);
};

export default handleRepeatGame;
