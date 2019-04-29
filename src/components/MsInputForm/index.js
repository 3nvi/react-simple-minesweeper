import { connect } from 'react-redux';
import { createGame } from 'ducks/game';
import MsInputForm from './MsInputForm';

const mapDispatchToProps = { createGame };

export default connect(
  null,
  mapDispatchToProps
)(MsInputForm);
