import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import MsGridCell, { minesToColorArray } from './MsGridCell';

describe('MsGridCell', () => {
  const baseCell = {
    index: 0,
    fromUserActivity: false,
    timestamp: 0,
  };

  it('displays the correct value', () => {
    // -1 means mine
    const { getByText, rerender } = render(
      <MsGridCell
        cell={{ ...baseCell, neighbouringMines: -1, opened: true }}
        gameInProgress
        openCell={jest.fn()}
      />
    );
    expect(getByText('💣')).toBeTruthy();

    // 0 means empty html (the selector helps us isolate the correct thing)
    rerender(
      <MsGridCell
        cell={{ ...baseCell, neighbouringMines: 0, opened: true }}
        gameInProgress
        openCell={jest.fn()}
      />
    );
    expect(getByText('', { selector: 'button' })).toBeTruthy();

    // any other number is shown pristine
    rerender(
      <MsGridCell
        cell={{ ...baseCell, neighbouringMines: 1, opened: true }}
        gameInProgress
        openCell={jest.fn()}
      />
    );
    expect(getByText('1')).toBeTruthy();

    // Hidden cells have no content
    rerender(
      <MsGridCell
        cell={{ ...baseCell, neighbouringMines: 1, opened: false }}
        gameInProgress
        openCell={jest.fn()}
      />
    );
    expect(getByText('', { selector: 'button' })).toBeTruthy();
  });

  it('changes color between numbers', () => {
    const { getByText } = render(
      <div>
        <MsGridCell
          cell={{ ...baseCell, neighbouringMines: 1, opened: true }}
          gameInProgress
          openCell={jest.fn()}
        />
        <MsGridCell
          cell={{ ...baseCell, neighbouringMines: 2, opened: true }}
          gameInProgress
          openCell={jest.fn()}
        />
      </div>
    );
    expect(getComputedStyle(getByText('1')).getPropertyValue('color')).toEqual(
      minesToColorArray[0]
    );
    expect(getComputedStyle(getByText('2')).getPropertyValue('color')).toEqual(
      minesToColorArray[1]
    );
  });

  it('makes sure that open and closed cells have different background colors', () => {
    const { getByText } = render(
      <div>
        <MsGridCell
          cell={{ ...baseCell, neighbouringMines: 1, opened: false }}
          gameInProgress
          openCell={jest.fn()}
        />
        <MsGridCell
          cell={{ ...baseCell, neighbouringMines: 2, opened: true }}
          gameInProgress
          openCell={jest.fn()}
        />
      </div>
    );
    expect(
      getComputedStyle(getByText('', { selector: 'button' })).getPropertyValue('background-color')
    ).not.toEqual(getComputedStyle(getByText('2')).getPropertyValue('background-color'));
  });

  it('turns a cell red if the user clicks on it and it has a bomb', () => {
    const { getByText } = render(
      <MsGridCell
        cell={{ ...baseCell, neighbouringMines: -1, fromUserActivity: true, opened: true }}
        gameInProgress
        openCell={jest.fn()}
      />
    );
    expect(getComputedStyle(getByText('💣')).getPropertyValue('background-color')).toEqual('red');
  });

  it('does not call `openCell` if the game is not in progress', () => {
    const openCellMock = jest.fn();
    const { getByText } = render(
      <MsGridCell
        cell={{ ...baseCell, opened: false, neighbouringMines: 1 }}
        gameInProgress={false}
        openCell={openCellMock}
      />
    );

    fireEvent.click(getByText('', { selector: 'button' }));
    expect(openCellMock.mock.calls.length).toEqual(0);
  });

  it('does not call `openCell` if a cell is already opened', () => {
    const openCellMock = jest.fn();
    const { getByText } = render(
      <MsGridCell
        cell={{ ...baseCell, neighbouringMines: 2, opened: true }}
        gameInProgress
        openCell={openCellMock}
      />
    );

    fireEvent.click(getByText('2'));
    expect(openCellMock.mock.calls.length).toEqual(0);
  });

  it('correctly calls `openCell` on all other cases', () => {
    const openCellMock = jest.fn();
    const { getByText } = render(
      <MsGridCell
        cell={{ ...baseCell, neighbouringMines: 1, opened: false }}
        gameInProgress
        openCell={openCellMock}
      />
    );

    fireEvent.click(getByText('', { selector: 'button' }));
    expect(openCellMock.mock.calls.length).toEqual(1);
    expect(openCellMock.mock.calls[0][0]).toEqual({
      cellIndex: baseCell.index,
      isUserActivity: true,
    });
  });
});
