export const REDUX_STATE_KEY = 'game';
export const getReduxStateSlice = state => state[REDUX_STATE_KEY];

export const getGameGrid = state => getReduxStateSlice(state).grid;
export const getGameCell = (state, cellIndex) => getGameGrid(state)[cellIndex];
export const getRowCount = state => getReduxStateSlice(state).rowCount;
export const getColumnCount = state => getReduxStateSlice(state).columnCount;
export const getMineCount = state => getReduxStateSlice(state).mineCount;
export const getGameStatus = state => getReduxStateSlice(state).gameStatus;
export const getElapsedGameTime = state => getReduxStateSlice(state).elapsedTime;
