import { getRowCount, getColumnCount, getMineCount, CONSTRUCT_GRID } from 'ducks/game';
import { sampleSize } from 'lodash';
import { findNeighbouringCells } from 'utils/common';

const handleConstructGrid = store => next => action => {
  // Whenever the `CONSTRUCT_GRID` action is fired, then we make sure to create
  // an mine-distances array that will override the "undefined" mine-distances that the current grid
  // has
  if (action.type === CONSTRUCT_GRID) {
    const state = store.getState();
    const rowCount = getRowCount(state);
    const columnCount = getColumnCount(state);
    const mineCount = getMineCount(state);
    const { initialCellIndex } = action.payload;

    // create an array with values from 0...(rowCount*columnCount) and randomly select some of those
    // values. The values will play the role of array indices on our future grid.
    // We make sure to remove our `initialCellIndex` from the possible "mine" indices so that the
    // first click that the user has already made is not mapped to a cell that contains a mine
    const arrayofIndices = [...Array(rowCount * columnCount)].map((__, index) => index);
    const arrayOfIndicesWithoutInitial = arrayofIndices.filter(v => v !== initialCellIndex);
    const mineIndices = sampleSize(arrayOfIndicesWithoutInitial, mineCount);

    // We will create an array with integers in it. The convention will be the following:
    // N === -1 ---> Mine
    // N >= 0 ---> Number of mines around this cell

    // create a flat version of our grid, filled with undefined values
    const flatGrid = [...Array(rowCount * columnCount)];

    // replace the corresponding cells with mines, according our mineIndices look-up array
    const flatGridWithMines = flatGrid.map((__, i) => (mineIndices.includes(i) ? -1 : undefined));

    // fill the non-mine cells with the correct values, designating how many mines does every cell
    // have around it. Finally, add it to the payload of this action before it is dispatched and
    // handled by the reducer
    action.payload.neighbouringMinesArray = flatGridWithMines.map((cellValue, cellIndex) => {
      // if the cell is a bomb, then move to the next cell
      if (cellValue === -1) {
        return cellValue;
      }

      // if it's not a bomb, then we must find the surrounding mines around the cell. Isolate all
      // the "-1" values (i.e. mines) in the surrounding cells and return the number of mines
      // around this cell
      const neighbouringCells = findNeighbouringCells(flatGridWithMines, cellIndex, columnCount);
      return neighbouringCells.filter(val => val === -1).length;
    });
  }

  next(action);
};

export default handleConstructGrid;
