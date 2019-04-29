import { chunk } from 'lodash';
/**
 * Given a cell-index within a 1xN array, it retrieves the neighbouring cells of the given cell
 *
 * @param flatGrid{Array<any>}: an 1D-array
 * @param cellIndex{Number}: the index of the cell within the flatGrid
 * @param columnCount{Number}: the number of columns that the 1D-array would
 * be split in, if it was represented as a 2D-grid
 *
 * @returns The (up to 8) neighbouring cells of that particular cell
 */

export const findNeighbouringCells = (flatGrid, cellIndex, columnCount) => {
  if (!flatGrid) {
    throw new Error('No grid specified');
  }

  if (!flatGrid.length || cellIndex >= flatGrid.length) {
    return [];
  }

  // convert the 1D-array into a 2D one
  const grid = chunk(flatGrid, columnCount);
  const rowIndex = Math.floor(cellIndex / columnCount);
  const columnIndex = cellIndex % columnCount;

  // add additional cells to the 2d matrix for convenience of computations.
  // We are adding 2 additional rows (one at the start and one at the end) and
  // 2 additional columns (one at the start and one at the end).
  const gridWithExtraRowsAndColumns = [
    [...Array(columnCount + 2)],
    ...grid.map(row => [undefined, ...row, undefined]),
    [...Array(columnCount + 2)],
  ];

  // just because we added extra rows & columns, we need to shift the user's
  // selection by 1 (since we prepended 1 row and 1 column)
  const newRowIndex = rowIndex + 1;
  const newColumnIndex = columnIndex + 1;

  // get the neighbouring cells and filter out any cells that were added as
  // helpers (their values will be undefined)
  return [
    gridWithExtraRowsAndColumns[newRowIndex - 1][newColumnIndex - 1],
    gridWithExtraRowsAndColumns[newRowIndex - 1][newColumnIndex],
    gridWithExtraRowsAndColumns[newRowIndex - 1][newColumnIndex + 1],

    gridWithExtraRowsAndColumns[newRowIndex][newColumnIndex - 1],
    gridWithExtraRowsAndColumns[newRowIndex][newColumnIndex + 1],

    gridWithExtraRowsAndColumns[newRowIndex + 1][newColumnIndex - 1],
    gridWithExtraRowsAndColumns[newRowIndex + 1][newColumnIndex],
    gridWithExtraRowsAndColumns[newRowIndex + 1][newColumnIndex + 1],
  ].filter(n => n !== undefined);
};

/**
 * Given the milliseconds, it converts them into a human readable form
 *
 * @param milliseconds{Number}: Self explanatory
 * @returns The time into a HH:MM:SS format
 */
export const formatTime = milliseconds => {
  const normalize = value => (value < 10 ? `0${value}` : `${value}`);

  const date = new Date(milliseconds);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();

  const minutesAndSeconds = `${normalize(minutes)}:${normalize(seconds)}`;
  return hours ? `${normalize(hours)}:${minutesAndSeconds}` : minutesAndSeconds;
};
