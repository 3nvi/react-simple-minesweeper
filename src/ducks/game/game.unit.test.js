import { createStore } from 'store';
import {
  createGame,
  resetGame,
  finishGame,
  repeatGame,
  tickGameTime,
  constructGrid,
  openCell,
} from './actions';
import {
  getColumnCount,
  getElapsedGameTime,
  getGameCell,
  getGameGrid,
  getGameStatus,
  getMineCount,
  getReduxStateSlice,
  getRowCount,
} from './selectors';
import { initialState } from './reducer';
import { GAME_STATUSES as statuses } from 'utils/constants';

describe('Game Duck', () => {
  let store;

  beforeEach(() => {
    store = createStore();
  });

  it('correctly creates a dummy grid through the `createGame` action', () => {
    const store = createStore();

    store.dispatch(createGame({ rowCount: 2, columnCount: 2, mineCount: 1 }));
    expect(getGameGrid(store.getState())).toEqual(
      [...Array(2 * 2)].map((__, index) => ({
        neighbouringMines: undefined,
        opened: false,
        index,
        fromUserActivity: undefined,
      }))
    );
    expect(getRowCount(store.getState())).toEqual(2);
    expect(getColumnCount(store.getState())).toEqual(2);
    expect(getMineCount(store.getState())).toEqual(1);
    expect(getGameStatus(store.getState())).toEqual(statuses.GAME_IN_PROGRESS);
    expect(getElapsedGameTime(store.getState())).toEqual(0);
  });

  it('correctly resets the game through `resetGame`', () => {
    store.dispatch(createGame({ rowCount: 2, columnCount: 2, mineCount: 1 }));
    store.dispatch(resetGame());
    expect(getReduxStateSlice(store.getState())).toEqual(initialState);
  });

  it('correctly ends the game through `finishGame`', () => {
    store.dispatch(createGame({ rowCount: 2, columnCount: 2, mineCount: 1 }));

    store.dispatch(finishGame(statuses.GAME_OVER));
    expect(getGameStatus(store.getState())).toEqual(statuses.GAME_OVER);

    store.dispatch(finishGame(statuses.GAME_WON));
    expect(getGameStatus(store.getState())).toEqual(statuses.GAME_WON);
  });

  it('correctly repeats the game through `repeatGame`', () => {
    store.dispatch(createGame({ rowCount: 2, columnCount: 2, mineCount: 1 }));
    store.dispatch(finishGame(statuses.GAME_OVER));
    store.dispatch(repeatGame());

    expect(getRowCount(store.getState())).toEqual(2);
    expect(getColumnCount(store.getState())).toEqual(2);
    expect(getMineCount(store.getState())).toEqual(1);
    expect(getGameStatus(store.getState())).toEqual(statuses.GAME_IN_PROGRESS);
    expect(getElapsedGameTime(store.getState())).toEqual(0);
  });

  it('correctly increases time elapsed through `tickGameTime`', () => {
    store.dispatch(createGame({ rowCount: 2, columnCount: 2, mineCount: 1 }));
    store.dispatch(tickGameTime(1000));
    expect(getElapsedGameTime(store.getState())).toEqual(1000);
  });

  it('correctly creates a grid through `constructGrid`', () => {
    // expect a normal grid in the happy path scenario
    store.dispatch(createGame({ rowCount: 2, columnCount: 2, mineCount: 1 }));
    store.dispatch(constructGrid(1));

    let gameGrid = getGameGrid(store.getState());
    expect(gameGrid.filter(c => c.neighbouringMines === -1).length).toEqual(1);
    expect(gameGrid.filter(c => c.neighbouringMines >= 0).length).toEqual(3);

    // // make sure that the index passed to construct grid is never been chosen
    // // as a bomb cell
    store.dispatch(createGame({ rowCount: 1, columnCount: 1, mineCount: 1 }));
    store.dispatch(constructGrid(0));

    gameGrid = getGameGrid(store.getState());
    expect(gameGrid.filter(x => x.neighbouringMines === -1).length).toEqual(0);
    expect(gameGrid.filter(x => x.neighbouringMines >= 0).length).toEqual(1);
  });

  it('correctly marks a cell as opened', () => {
    store.dispatch(createGame({ rowCount: 2, columnCount: 2, mineCount: 1 }));

    store.dispatch(openCell({ cellIndex: 0, isUserActivity: true }));
    store.dispatch(openCell({ cellIndex: 1, isUserActivity: false }));

    const firstCell = getGameCell(store.getState(), 0);
    const secondCell = getGameCell(store.getState(), 1);

    expect(firstCell.opened).toBeTruthy();
    expect(firstCell.fromUserActivity).toBeTruthy();

    expect(secondCell.opened).toBeTruthy();
    expect(secondCell.fromUserActivity).toBeFalsy();
  });
});
