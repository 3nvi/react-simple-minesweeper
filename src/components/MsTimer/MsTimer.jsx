import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { formatTime } from 'utils/common';
import { GAME_STATUSES as statuses } from 'utils/constants';

function MsTimer({ elapsedTime, gameStatus, tickGameTime }) {
  // we need a solid reference between re-renders
  const interval = useRef(null);

  // whenever the gameStatus changes, update the interval (the tickGameTime will
  // always have a fixed reference, but we add it for ESLint reasons)
  useEffect(() => {
    // if the `gameStatus` changes to "IN_PROGRESS" then it came from a stopped
    // state. Thus, we begin our timer
    if (gameStatus === statuses.GAME_IN_PROGRESS) {
      interval.current = setInterval(() => tickGameTime(1000), 1000);

      // If the `gameStatus` changed to anything other than "IN_PROGRESS", then
      // we need to stop the interval (since either the user won, lost, exited
      // or resetted the game)
    } else {
      clearInterval(interval.current);
    }

    // make sure to always clear the interval on unmount
    return () => {
      clearInterval(interval.current);
    };
  }, [gameStatus, tickGameTime]);

  return <time>{formatTime(elapsedTime)}</time>;
}

MsTimer.reduxProps = {
  elapsedTime: PropTypes.number.isRequired,
  gameStatus: PropTypes.oneOf(Object.values(statuses)),
  tickGameTime: PropTypes.func.isRequired,
};

MsTimer.propTypes = {
  ...MsTimer.reduxProps,
};

MsTimer.defaultProps = {};

export default MsTimer;
