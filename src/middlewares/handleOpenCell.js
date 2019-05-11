import {
  SELECT_CELL,
  getColumnCount,
  getGameGrid,
  getGameCell,
  openCell,
  constructGrid,
  finishGame,
} from 'ducks/game';
import { GAME_STATUSES as statuses } from '../utils/constants';
import { findNeighbouringCells } from 'utils/common';

const handleOpenCell = store => next => action => {
  next(action);

  // Whenever a cell is about to open (REGARDLESS of whether the opening was
  // initiated by the user or by the system)
  if (action.type === SELECT_CELL) {
    const state = store.getState();
    const { cellIndex } = action.payload;

    const grid = getGameGrid(state);
    const columnCount = getColumnCount(state);

    // the cell that was selected to be opened. The `next(action)` has already
    // been called at the top, so essentially this cell was already marked as
    // opened. We wanna make sure if we wanna do more actions or not
    const selectedCell = getGameCell(state, cellIndex);

    // if the number of mines is undefined, then that means that our grid has
    // dummy values. Thus this is the first click of the game and we need to
    // construct a grid. After the grid is constructed, we re-open this cell
    // since we need to see whether this cell's opening needs to open more cells
    // (because no surrounding mines are there)
    if (selectedCell.neighbouringMines === undefined) {
      store.dispatch(constructGrid(selectedCell.index));
      store.dispatch(openCell({ cellIndex: selectedCell.index, isUserActivity: true }));

      // if the number of mines is 0, recursively open cells until either there
      // are no more cells to open or you reach cells with numbers in them
    } else if (selectedCell.neighbouringMines === 0) {
      const neighbouringCells = findNeighbouringCells(grid, cellIndex, columnCount);
      neighbouringCells.forEach(cell => {
        if (!cell.opened && !cell.flagged) {
          store.dispatch(openCell({ cellIndex: cell.index, isUserActivity: false }));
        }
      });

      // if the user tried to open a cell with a bomb in it, we automatically
      // finish the game with a "loss" status and we make sure to open all the
      // other bomb cells.
    } else if (selectedCell.neighbouringMines === -1) {
      // We make sure to attempt to open the mine cells, only when the user
      // has actually pressed one
      if (selectedCell.fromUserActivity) {
        store.dispatch(finishGame(statuses.GAME_OVER));
        const unopenedMineCells = grid.filter(
          cell => cell.neighbouringMines === -1 && !cell.opened
        );
        unopenedMineCells.forEach(cell =>
          store.dispatch(openCell({ cellIndex: cell.index, isUserActivity: false }))
        );
      }

      // If the cell that was opened was a numbered cell
    } else if (selectedCell.neighbouringMines > 0) {
      // We make sure that if there aren't any more unopened cells
      // which are NOT mines, then we automatically mark the game as won.
      // We know that no mine cells have been opened, else the above statement
      // would have caught it
      if (!grid.some(cell => !cell.opened && cell.neighbouringMines !== -1)) {
        store.dispatch(finishGame(statuses.GAME_WON));
      }
    }
  }
};

export default handleOpenCell;
