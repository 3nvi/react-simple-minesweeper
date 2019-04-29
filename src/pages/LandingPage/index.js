import { connect } from 'react-redux';
import { getGameStatus } from 'ducks/game';
import LandingPage from './LandingPage';

const mapStateToProps = state => ({
  gameStatus: getGameStatus(state),
});

export default connect(mapStateToProps)(LandingPage);
