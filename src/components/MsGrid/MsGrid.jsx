import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled';
import cellShape from 'shapes/cell';
import MsGridCell from 'components/MsGridCell';
import { GRID_CELL_SIZE } from 'utils/constants';

const MsGridContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`;

const MsGridWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: ${props => `${props.columns * GRID_CELL_SIZE}px`};
  margin: 0 auto;
`;

function MsGrid({ grid, columnCount }) {
  // grid is a 1D array. We take advantage of flexbox to properly represent it
  // as a 2D one.
  return (
    <MsGridContainer>
      <MsGridWrapper columns={columnCount} data-testid="ms-grid">
        {grid.map(cell => (
          <MsGridCell cell={cell} key={cell.index} />
        ))}
      </MsGridWrapper>
    </MsGridContainer>
  );
}

MsGrid.reduxProps = {
  columnCount: PropTypes.number.isRequired,
  grid: PropTypes.arrayOf(PropTypes.shape(cellShape)).isRequired,
};

MsGrid.propTypes = {
  ...MsGrid.reduxProps,
};

export default MsGrid;
