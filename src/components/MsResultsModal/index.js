import { connect } from 'react-redux';
import {
  getGameStatus,
  resetGame,
  repeatGame,
  getMineCount,
  getFlaggedCellCount,
} from 'ducks/game';
import MsResultsModal from './MsResultsModal';

const mapStateToProps = state => ({
  gameStatus: getGameStatus(state),
  remainingFlagCount: getMineCount(state) - getFlaggedCellCount(state),
});

const mapDispatchToProps = {
  resetGame,
  repeatGame,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MsResultsModal);
