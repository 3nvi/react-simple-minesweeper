import { simpleAction } from '../utils';
import {
  CREATE_GAME,
  RESET_GAME,
  REPEAT_GAME,
  CONSTRUCT_GRID,
  SELECT_CELL,
  FLAG_CELL_TOGGLE,
  FINISH_GAME,
  TICK_GAME_TIME,
} from './types';

// Creates a game through according to the user parameters: initialises an
// empty grid of undefined values. The grid will be properly constructed after
// the user's first cell opening
export const createGame = ({ rowCount, columnCount, mineCount }) =>
  simpleAction(CREATE_GAME, {
    rowCount,
    columnCount,
    mineCount,
  });

// Resets the game and redirects the user to the Data input screen (form)
export const resetGame = () => simpleAction(RESET_GAME);

// Restarts the game with the same parameters (width,height,mines)
// See ***  `src/middlewares/handleRepeatGame.js` ***
export const repeatGame = () => simpleAction(REPEAT_GAME);

// Marks the game as finished and updates the status based on the `status` param given
export const finishGame = status => simpleAction(FINISH_GAME, { status });

// Creates the grid: places bombs in random squares (except for the cellIndex that was given
// as a parameter) and calculates the mine distances for all cells.
// ***  See `src/middlewares/handleConstructGrid.js` ***
export const constructGrid = initialCellIndex => simpleAction(CONSTRUCT_GRID, { initialCellIndex });

// Increases the currently active game counter by `milliseconds`
export const tickGameTime = milliseconds => simpleAction(TICK_GAME_TIME, { milliseconds });

// An action to open a cell based on its index. The `isUserActivity` tells us
// whether the user opened it or whether it was a result of an automatic
// propagation.
// *** See `src/middlewares/handleOpenCell.js` ***
export const openCell = ({ cellIndex, isUserActivity }) =>
  simpleAction(SELECT_CELL, { cellIndex, isUserActivity });

// mark a cell as a potential candidate for a bomb, by placing a flag on it
export const toggleFlagCell = ({ cellIndex }) => simpleAction(FLAG_CELL_TOGGLE, { cellIndex });
