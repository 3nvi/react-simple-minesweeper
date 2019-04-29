import * as types from './types';
import { GAME_STATUSES as statuses } from 'utils/constants';

export const initialState = {
  // number of rows in the minesweeper grid
  rowCount: undefined,

  // number of columns in the minesweeper grid
  columnCount: undefined,

  // number of mines in the minesweeper grid
  mineCount: undefined,

  // the current status of the game
  gameStatus: statuses.GAME_SELECTION,

  // the elapsed time (in milliseconds) since the user started playing. Will
  // be stopped as soon as the game is resetted, restarted or finished
  elapsedTime: 0,

  // The grid of the minesweeper represented as a 1D array (for extremely easy
  // calculations)
  grid: null,
};

function gameReducer(state = initialState, action) {
  switch (action.type) {
    // initialize a dummy-grid with `undefined` data. Will be overriden
    // as soon as the user selects a cell (through the `constructGrid` action)
    case types.CREATE_GAME: {
      const { rowCount, columnCount, mineCount } = action.payload;
      return {
        ...state,
        rowCount: rowCount,
        columnCount: columnCount,
        mineCount: mineCount,
        gameStatus: statuses.GAME_IN_PROGRESS,
        elapsedTime: 0,
        grid: [...Array(rowCount * columnCount)].map((__, index) => ({
          // number of mines around the cell
          neighbouringMines: undefined,

          // whether the cell was opened or not
          opened: false,

          // the index of the cell within the array (it helps a lot since we
          // don't have any other uniqueID for a cell)
          index,

          // whether the cell was opened by the user or the system
          fromUserActivity: undefined,
        })),
      };
    }

    // updates the existing grid with the data needed (calculated within
    // `src/middlewares/handleConstructGrid.js`)
    case types.CONSTRUCT_GRID:
      return {
        ...state,
        grid: state.grid.map((cell, index) => ({
          ...cell,
          neighbouringMines: action.payload.neighbouringMinesArray[index],
        })),
      };

    // marks a cell as selected and stores related data (timestamp of selection
    // and whether the action was initiated by the user or the system)
    case types.SELECT_CELL:
      return {
        ...state,
        grid: state.grid.map((cell, index) =>
          index === action.payload.cellIndex
            ? {
                ...cell,
                fromUserActivity: action.payload.isUserActivity,
                opened: true,
                timestamp: state.elapsedTime,
              }
            : cell
        ),
      };

    case types.TICK_GAME_TIME:
      return {
        ...state,
        elapsedTime: state.elapsedTime + action.payload.milliseconds,
      };
    case types.RESET_GAME:
      return { ...initialState };
    case types.FINISH_GAME:
      return { ...state, gameStatus: action.payload.status };
    default:
      return state;
  }
}

export default gameReducer;
