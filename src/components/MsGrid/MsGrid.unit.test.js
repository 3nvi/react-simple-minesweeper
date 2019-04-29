import React from 'react';
import { render } from 'react-testing-library';
import MsGrid from './MsGrid';

jest.mock('components/MsGridCell', () => () => <div data-testid="gridcell" />);

describe('MsGrid', () => {
  it('renders a list of `MsGridCell` components', () => {
    const cell1 = {
      index: 0,
      fromUserActivity: false,
      timestamp: undefined,
      opened: false,
      neighbouringMines: 1,
    };

    const cell2 = {
      index: 1,
      fromUserActivity: false,
      timestamp: undefined,
      opened: false,
      neighbouringMines: 1,
    };

    const { getAllByTestId } = render(<MsGrid columnCount={1} grid={[cell1, cell2]} />);
    expect(getAllByTestId('gridcell').length).toEqual(2);
  });
});
