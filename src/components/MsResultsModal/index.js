import { connect } from 'react-redux';
import { getGameStatus, resetGame, repeatGame } from 'ducks/game';
import MsResultsModal from './MsResultsModal';

const mapStateToProps = state => ({
  gameStatus: getGameStatus(state),
});

const mapDispatchToProps = {
  resetGame,
  repeatGame,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MsResultsModal);
