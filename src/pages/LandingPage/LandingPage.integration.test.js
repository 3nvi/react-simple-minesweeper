import React from 'react';
import { createStore } from 'store';
import { Provider } from 'react-redux';
import { render, fireEvent, waitForElement, wait } from 'react-testing-library';
import LandingPage from 'pages/LandingPage';
import { getGameGrid } from 'ducks/game';

// utility function for quickly bypassing the form screen within the tests
const fillGameFormAndCreateGame = async ({ rowCount, columnCount, mineCount }) => {
  const store = createStore();
  const queries = render(
    <Provider store={store}>
      <LandingPage />
    </Provider>
  );

  fireEvent.change(queries.getByLabelText(/number of rows/i), { target: { value: rowCount } });
  fireEvent.change(queries.getByLabelText(/number of columns/i), {
    target: { value: columnCount },
  });
  fireEvent.change(queries.getByLabelText(/number of mines/i), { target: { value: mineCount } });
  fireEvent.click(queries.getByText('Play'));

  // wait until a grid appears on the screen
  await waitForElement(() => queries.getByTestId('ms-grid'));

  // return the store and the available queries
  return { store, queries };
};

describe('LandingPage', () => {
  it('renders a form & creates a minesweeper from it', async () => {
    const { queries } = await fillGameFormAndCreateGame({
      rowCount: 8,
      columnCount: 8,
      mineCount: 20,
    });

    expect(queries.getAllByTestId(/ms-grid-cell/).length).toEqual(8 * 8);
  });

  it('loses the game if a user clicks on a mine and reveals all other mines', async () => {
    const { store, queries } = await fillGameFormAndCreateGame({
      rowCount: 8,
      columnCount: 8,
      mineCount: 20,
    });

    // click on a cell
    fireEvent.click(queries.getByTestId('ms-grid-cell--0'));

    // wait a bit until the grid is constructed
    await window.sleep(500);

    // find a cell that contains a mine
    const mineCell = getGameGrid(store.getState()).find(c => c.neighbouringMines === -1);

    // click on this cell
    fireEvent.click(queries.getByTestId(`ms-grid-cell--${mineCell.index}`));

    // expect to see loss text
    const lossText = await waitForElement(() => queries.getByText(/game over/i));
    expect(lossText).toBeTruthy();

    // expect to see all the bombs revealed
    expect(queries.getAllByText('💣').length).toEqual(20);
  });

  it('wins the game if a user clicks open all the cells apart from the mines', async () => {
    const { store, queries } = await fillGameFormAndCreateGame({
      rowCount: 8,
      columnCount: 8,
      mineCount: 20,
    });

    // click on a cell
    fireEvent.click(queries.getByTestId('ms-grid-cell--0'));

    // wait a bit until the grid is constructed
    await window.sleep(500);

    // find all the cells that do not contain mines
    const nonMineCells = getGameGrid(store.getState()).filter(
      c => c.neighbouringMines >= 0 && !c.opened
    );

    // click on all of these cells
    nonMineCells.forEach(nonMineCell =>
      fireEvent.click(queries.getByTestId(`ms-grid-cell--${nonMineCell.index}`))
    );

    // expect to see victory text
    const victoryText = await waitForElement(() => queries.getByText(/you won/i));
    expect(victoryText).toBeTruthy();
  });

  it('makes sure to keep opening cells, if a cell without a mine nearby is opened', async () => {
    const { store, queries } = await fillGameFormAndCreateGame({
      rowCount: 8,
      columnCount: 8,
      mineCount: 20,
    });

    // click on a cell in order to get the grid constructed
    fireEvent.click(queries.getByTestId('ms-grid-cell--0'));

    // wait a bit until the grid is constructed
    await window.sleep(500);

    // find the current cells that have mines as neighbour and store them for
    // a future comparison
    const currentCellsWithNeighbourMines = queries
      .getAllByTestId(/ms-grid-cell/)
      .filter(cell => Boolean(cell.innerHTML)).length;

    // find a cell that has 0 neighbouring mines
    const cellWithoutNeighbourMines = getGameGrid(store.getState()).find(
      c => c.neighbouringMines === 0 && !c.opened
    );

    // click on it
    fireEvent.click(queries.getByTestId(`ms-grid-cell--${cellWithoutNeighbourMines.index}`));

    // expect to see at least more cells with mines as neighbours, by clicking this cell that
    // DIDN'T have any mines as neighbours. It needs to be greater than what it was before
    // by AT LEAST 3 (since 3 is the minimum number of neighbours that any cell can have
    await wait(() => {
      expect(
        queries.getAllByTestId(/ms-grid-cell/).filter(cell => Boolean(cell.innerHTML)).length
      ).toBeGreaterThanOrEqual(currentCellsWithNeighbourMines + 3);
    });
  });

  it('stops the timer whenever a loss occurs', async () => {
    const { store, queries } = await fillGameFormAndCreateGame({
      rowCount: 2,
      columnCount: 2,
      mineCount: 1,
    });

    // click on a cell
    fireEvent.click(queries.getByTestId('ms-grid-cell--0'));

    // wait a bit until the grid is constructed
    await window.sleep(500);

    // find a cell that contains a mine
    const mineCell = getGameGrid(store.getState()).find(c => c.neighbouringMines === -1);

    // click on this cell
    fireEvent.click(queries.getByTestId(`ms-grid-cell--${mineCell.index}`));

    // get the current time
    const timerValue = queries.container.querySelector('time').innerHTML;

    // wait a few seconds in order to allow the timer to potentially change
    await window.sleep(1500);

    // read it again
    const timerValue2 = queries.container.querySelector('time').innerHTML;

    // expect the 2 time snapshots to be the same, thus the timer is not counting
    expect(timerValue).toEqual(timerValue2);
  });

  it('stops the timer whenever a victory occurs', async () => {
    const { store, queries } = await fillGameFormAndCreateGame({
      rowCount: 8,
      columnCount: 8,
      mineCount: 20,
    });

    // click on a cell
    fireEvent.click(queries.getByTestId('ms-grid-cell--0'));

    // wait a bit until the grid is constructed
    await window.sleep(500);

    // find all the cells that do not contain mines
    const nonMineCells = getGameGrid(store.getState()).filter(
      c => c.neighbouringMines >= 0 && !c.opened
    );

    // click on all of these cells
    nonMineCells.forEach(nonMineCell =>
      fireEvent.click(queries.getByTestId(`ms-grid-cell--${nonMineCell.index}`))
    );

    // get the current time
    const timerValue = queries.container.querySelector('time').innerHTML;

    // wait a few seconds in order to allow the timer to potentially change
    await window.sleep(1500);

    // read it again
    const timerValue2 = queries.container.querySelector('time').innerHTML;

    // expect the 2 time snapshots to be the same, thus the timer is not counting
    expect(timerValue).toEqual(timerValue2);
  });

  it('returns to the form page when "Exit" button is clicked', async () => {
    const { queries } = await fillGameFormAndCreateGame({
      rowCount: 2,
      columnCount: 2,
      mineCount: 1,
    });

    // click on the "exit" button
    fireEvent.click(queries.getByTitle(/back to home/i));

    // expect to see the form again and no timers
    expect(queries.getByLabelText(/number of rows/i)).toBeTruthy();
    expect(queries.getByLabelText(/number of columns/i)).toBeTruthy();
    expect(queries.getByLabelText(/number of mines/i)).toBeTruthy();
  });

  it('resets the game when "Retry" button is clicked', async () => {
    const { queries } = await fillGameFormAndCreateGame({
      rowCount: 2,
      columnCount: 2,
      mineCount: 1,
    });

    // click on a cell
    fireEvent.click(queries.getByTestId('ms-grid-cell--0'));

    // add a small delay to simulate user lag
    await window.sleep(1000);

    // read the timer value and expect it to be something other than 00:00
    let timerValue = queries.container.querySelector('time').innerHTML;
    expect(timerValue).not.toEqual('00:00');

    // click on the "retry" button
    fireEvent.click(queries.getByTitle(/retry/i));

    // calculate the number of cells with numbers and expect them to be 0, since
    // all the cells should be closed after the "retry" button was clicked
    // (since we clicked on something)
    const hiddenCells = queries.getAllByTestId(/ms-grid-cell/).filter(cell => !cell.innerHTML)
      .length;
    expect(hiddenCells).toEqual(2 * 2);

    // read the timer value and expect it to equal 00:00, since we resetted
    timerValue = queries.container.querySelector('time').innerHTML;
    expect(timerValue).toMatch('00:00');
  });
});
