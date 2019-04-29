import { connect } from 'react-redux';
import { getElapsedGameTime, getGameStatus, tickGameTime } from 'ducks/game';
import MsTimer from './MsTimer';

const mapStateToProps = state => ({
  elapsedTime: getElapsedGameTime(state),
  gameStatus: getGameStatus(state),
});

const mapDispatchToProps = { tickGameTime };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MsTimer);
