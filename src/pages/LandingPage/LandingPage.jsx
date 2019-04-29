import React from 'react';
import PropTypes from 'prop-types';
import MsInputForm from 'components/MsInputForm';
import MsGrid from 'components/MsGrid';
import MsResultsModal from 'components/MsResultsModal';
import { GAME_STATUSES as statuses, RESULTS_MODAL_HEIGHT } from 'utils/constants';
import { animated, useTransition } from 'react-spring';

function LandingPage({ gameStatus }) {
  // The css data needed to perform the transition of the Modal
  const transitions = useTransition(gameStatus !== statuses.GAME_SELECTION, null, {
    from: { transform: `translateY(-${RESULTS_MODAL_HEIGHT}px)`, opacity: 0 },
    enter: { transform: 'translateY(0)', opacity: 1 },
    leave: { transform: `translateY(-${RESULTS_MODAL_HEIGHT}px)`, opacity: 0 },
  });

  // We always attempt to mount the Modal (the `transitions` key will take care
  // of whether the actual component needs to be mounted or not) and we choose
  // to either display the form or the minesweeper grid, depending on the
  // status of the current game
  return (
    <React.Fragment>
      {transitions.map(
        ({ item, key, props }) =>
          item && (
            <animated.div key={key} style={props}>
              <MsResultsModal />
            </animated.div>
          )
      )}
      {gameStatus === statuses.GAME_SELECTION ? <MsInputForm /> : <MsGrid />}
    </React.Fragment>
  );
}

LandingPage.reduxProps = {
  gameStatus: PropTypes.oneOf(Object.values(statuses)),
};

LandingPage.propTypes = {
  ...LandingPage.reduxProps,
};

export default LandingPage;
