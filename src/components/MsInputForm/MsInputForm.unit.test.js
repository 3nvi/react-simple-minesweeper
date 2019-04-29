import React from 'react';
import { render, fireEvent, waitForElement, wait } from 'react-testing-library';
import MsInputForm from './MsInputForm';

describe('MsInputForm', () => {
  it('renders the correct inputs on screen', () => {
    const { getByLabelText } = render(<MsInputForm createGame={jest.fn()} />);

    expect(getByLabelText(/Number of columns/i)).toBeTruthy();
    expect(getByLabelText(/Number of rows/i)).toBeTruthy();
    expect(getByLabelText(/Number of mines/i)).toBeTruthy();
  });

  it('rejects "0" or negative values as an input', async () => {
    const { getByLabelText, getAllByText, getByText } = render(
      <MsInputForm createGame={jest.fn()} />
    );

    const columnsInput = getByLabelText(/Number of columns/i);
    const rowsInput = getByLabelText(/Number of rows/i);
    const minesInput = getByLabelText(/Number of mines/i);

    // focus -> change -> blur is the one that triggers validation
    fireEvent.focus(columnsInput);
    fireEvent.change(columnsInput, { target: { value: 0 } });
    fireEvent.blur(columnsInput);

    fireEvent.focus(rowsInput);
    fireEvent.change(rowsInput, { target: { value: 0 } });
    fireEvent.blur(rowsInput);

    fireEvent.focus(minesInput);
    fireEvent.change(minesInput, { target: { value: 0 } });
    fireEvent.blur(minesInput);

    let errorMessages = await waitForElement(() => getAllByText(/at least 1/i));
    expect(errorMessages.length).toEqual(3);

    fireEvent.change(columnsInput, { target: { value: -1 } });
    fireEvent.change(rowsInput, { target: { value: -1 } });
    fireEvent.change(minesInput, { target: { value: -1 } });

    errorMessages = await waitForElement(() => getAllByText(/at least 1/i));
    expect(errorMessages.length).toEqual(3);

    const submitButton = getByText('Play');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('rejects mines that are equal or more than the cells', async () => {
    const { getByLabelText, getByText } = render(<MsInputForm createGame={jest.fn()} />);

    const columnsInput = getByLabelText(/Number of columns/i);
    const rowsInput = getByLabelText(/Number of rows/i);
    const minesInput = getByLabelText(/Number of mines/i);

    fireEvent.change(columnsInput, { target: { value: 2 } });
    fireEvent.change(rowsInput, { target: { value: 2 } });

    // 1st check: Equal to the number of cells
    fireEvent.focus(minesInput);
    fireEvent.change(minesInput, { target: { value: 4 } });
    fireEvent.blur(minesInput);

    // if it doesn't timeout here then this element was found, thus no need
    // to run an "expect" here
    await waitForElement(() => getByText(/less than the total number of cells/i));

    // 2nd check: More than the number of cells
    fireEvent.focus(minesInput);
    fireEvent.change(minesInput, { target: { value: 10 } });
    fireEvent.blur(minesInput);

    // if it doesn't timeout here then this element was found, thus no need
    // to run an "expect" here
    await waitForElement(() => getByText(/less than the total number of cells/i));

    const submitButton = getByText('Play');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('calls `createGame` with the correct params', async () => {
    const createGameMock = jest.fn();
    const { getByLabelText, getByText } = render(<MsInputForm createGame={createGameMock} />);

    const columnsInput = getByLabelText(/Number of columns/i);
    const rowsInput = getByLabelText(/Number of rows/i);
    const minesInput = getByLabelText(/Number of mines/i);

    fireEvent.change(columnsInput, { target: { value: 2 } });
    fireEvent.change(rowsInput, { target: { value: 2 } });
    fireEvent.change(minesInput, { target: { value: 2 } });
    fireEvent.click(getByText('Play'));

    // wait until the validation runs and we get a single `createGame` call
    // The "wait" below, waits until the function argument doesn't throw an error
    await wait(() => {
      if (!createGameMock.mock.calls.length) {
        throw new Error('Not ready yet');
      }
    });

    // expect to see a single call with correct parameters
    expect(createGameMock.mock.calls.length).toEqual(1);
    expect(createGameMock.mock.calls[0][0]).toEqual({
      rowCount: 2,
      columnCount: 2,
      mineCount: 2,
    });
  });
});
