import React from 'react';
import PropTypes from 'prop-types';
import { ReactComponent as RepeatSVG } from 'assets/repeat.svg';
import { ReactComponent as DeleteSVG } from 'assets/delete.svg';
import styled from '@emotion/styled';
import { css, keyframes } from '@emotion/core';
import MsTimer from 'components/MsTimer';
import { GAME_STATUSES as statuses } from 'utils/constants';

const ResultsModalWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 75px;
  display: grid;
  justify-items: center;
  align-items: center;
  grid-template-columns: 1fr 1fr 1fr;
  box-shadow: 2px 3px 5px #ddd;
  background-color: white;
`;

const ResultsModalInner = styled.div`
  display: flex;
  align-items: center;
  margin: auto;
`;

const scale = keyframes`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(0.5);
    
  }
  100% {
    transform: scale(1);
  }
`;

const base = css`
  font-size: 25px;
  font-weight: 400;
  animation: ${scale} 1s linear;
`;

const WinText = styled.h1`
  ${base};
  color: darkgreen;
`;

const LossText = styled.h1`
  ${base};
  color: darkred;
`;

const IconButtonContainer = styled.div`
  display: flex;

  button {
    margin: 0 10px;
  }
`;

const IconButton = styled.button`
  transition: background-color 0.2s linear;
  border-radius: 50%;
  font-size: 10px;
  width: 50px;
  height: 50px;
  border: 1px solid #ddd;
  color: #888;

  g,
  polygon,
  path {
    fill: #888;
  }

  &:hover {
    g,
    polygon,
    path {
      fill: white;
    }
    background-color: #666;
    border-color: #666;
    color: white;
  }
`;

const GameDataWrapper = styled.div`
  display: flex;

  > * {
    margin: 0 15px;
  }
`;

/**
 * The Header component that you see overlaying while you play a game
 */
function MsResultsModal({ gameStatus, repeatGame, resetGame, remainingFlagCount }) {
  return (
    <ResultsModalWrapper data-testid="ms-results-modal">
      <IconButtonContainer>
        <IconButton onClick={repeatGame} title="Retry">
          <RepeatSVG />
          <div>Retry</div>
        </IconButton>
        <IconButton onClick={resetGame} title="Back to Home screen">
          <DeleteSVG />
          <div>Exit</div>
        </IconButton>
      </IconButtonContainer>

      <ResultsModalInner>
        {gameStatus === statuses.GAME_WON && <WinText>You won!</WinText>}
        {gameStatus === statuses.GAME_OVER && <LossText>Game Over</LossText>}
      </ResultsModalInner>
      <GameDataWrapper>
        <div>Remaining Flags: {remainingFlagCount}</div>
        <MsTimer />
      </GameDataWrapper>
    </ResultsModalWrapper>
  );
}

MsResultsModal.reduxProps = {
  gameStatus: PropTypes.oneOf(Object.values(statuses)),
  remainingFlagCount: PropTypes.number.isRequired,
  repeatGame: PropTypes.func.isRequired,
  resetGame: PropTypes.func.isRequired,
};

MsResultsModal.propTypes = {
  ...MsResultsModal.reduxProps,
};

export default MsResultsModal;
