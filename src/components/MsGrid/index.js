import { connect } from 'react-redux';
import { getColumnCount, getGameGrid } from 'ducks/game';
import MsGrid from './MsGrid';

const mapStateToProps = state => ({
  columnCount: getColumnCount(state),
  grid: getGameGrid(state),
});

export default connect(mapStateToProps)(MsGrid);
