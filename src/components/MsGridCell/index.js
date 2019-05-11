import { connect } from 'react-redux';
import { GAME_STATUSES as statuses } from 'utils/constants';
import {
  getGameStatus,
  openCell,
  toggleFlagCell,
  getFlaggedCellCount,
  getMineCount,
} from 'ducks/game';
import MsGridCell from './MsGridCell';

const mapStateToProps = state => ({
  gameInProgress: getGameStatus(state) === statuses.GAME_IN_PROGRESS,
  flagsExhausted: getFlaggedCellCount(state) >= getMineCount(state),
});

const mapDispatchToProps = { openCell, toggleFlagCell };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MsGridCell);
