import React, { useMemo, useCallback, memo } from 'react';
import PropTypes from 'prop-types';
import cellShape from 'shapes/cell';
import styled from '@emotion/styled';
import { GRID_CELL_SIZE } from 'utils/constants';

export const minesToColorArray = ['blue', 'green', 'red', 'navy', 'brown', 'cyan', 'black', 'grey'];

const Cell = styled.button`
  transition: background-color 0.1s ease-in-out;
  font-weight: bold;
  outline: none;
  padding: 0;
  margin: 0;
  width: ${GRID_CELL_SIZE}px;
  height: ${GRID_CELL_SIZE}px;
  border: 1px solid #aaa;
  text-align: center;
  background-color: ${({ cellData }) => {
    if (cellData.opened) {
      // we display with a "red" background, the cell that contains a mine only
      // when the user has clicked on it. If it was opened as a result of the
      // use losing the game, then no red background is being displayed
      return cellData.neighbouringMines === -1 && cellData.fromUserActivity ? 'red' : '#eee';
    }

    // typical color for unopened cells
    return '#ddd';
  }};
  color: ${({ cellData }) => minesToColorArray[cellData.neighbouringMines - 1]};

  &:hover {
    background-color: ${({ cellData, gameInProgress }) =>
      !cellData.opened && gameInProgress ? '#e1e1e1' : undefined};
  }
`;

function MsGridCell(props) {
  const { cell, openCell, gameInProgress } = props;

  // when a user clicks a cell, we only perform the `openCell` action if a
  // game is still ongoing (i.e. has not finished) and the cell was not already
  // opened.
  const handleClick = useCallback(() => {
    if (!cell.opened && gameInProgress) {
      openCell({ cellIndex: cell.index, isUserActivity: true });
    }
  }, [gameInProgress, cell, openCell]);

  // We display a "bomb" when we are in a cell that contains a mine, nothing
  // when no mines are near this cell or the number of neighbouring mines (if
  // the cell has at least 1 around it)
  const renderedValue = useMemo(() => {
    switch (cell.neighbouringMines) {
      case -1:
        return '💣';
      case 0:
        return '';
      default:
        return cell.neighbouringMines;
    }
  }, [cell.neighbouringMines]);

  return (
    <Cell
      onClick={handleClick}
      cellData={cell}
      gameInProgress={gameInProgress}
      data-testid={`ms-grid-cell--${cell.index}`}
    >
      {cell.opened && renderedValue}
    </Cell>
  );
}

MsGridCell.reduxProps = {
  gameInProgress: PropTypes.bool.isRequired,
  openCell: PropTypes.func.isRequired,
};

MsGridCell.propTypes = {
  ...MsGridCell.reduxProps,
  cell: PropTypes.shape(cellShape),
};

export default memo(MsGridCell);
