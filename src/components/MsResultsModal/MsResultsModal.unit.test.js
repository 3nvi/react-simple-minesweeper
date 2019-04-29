import React from 'react';
import { render, fireEvent } from 'react-testing-library';
import { GAME_STATUSES as statuses } from 'utils/constants';
import MsResultsModal from './MsResultsModal';

jest.mock('components/MsTimer', () => () => <div data-testid="timer" />);

describe('MsResultsModal', () => {
  it('fires `repeatGame` & `resetGame` when the corresponding buttons are clicked', () => {
    const repeatGameMock = jest.fn();
    const resetGameMock = jest.fn();

    const { getByTitle } = render(
      <MsResultsModal
        gameStatus={statuses.GAME_IN_PROGRESS}
        repeatGame={repeatGameMock}
        resetGame={resetGameMock}
      />
    );

    fireEvent.click(getByTitle(/retry/i));
    fireEvent.click(getByTitle(/back to home screen/i));

    expect(repeatGameMock.mock.calls.length).toEqual(1);
    expect(resetGameMock.mock.calls.length).toEqual(1);
  });

  it('renders a timer', () => {
    const { getByTestId } = render(
      <MsResultsModal
        gameStatus={statuses.GAME_IN_PROGRESS}
        repeatGame={jest.fn()}
        resetGame={jest.fn()}
      />
    );

    expect(getByTestId('timer')).toBeTruthy();
  });

  it('renders the proper text depending on the game state', () => {
    // expect to not see victory-related text if the user won the game
    const { getByText, queryByText, rerender } = render(
      <MsResultsModal gameStatus={statuses.GAME_WON} repeatGame={jest.fn()} resetGame={jest.fn()} />
    );
    expect(getByText(/You won/i)).toBeTruthy();

    // expect to not see loss-related text if the user lost the game
    rerender(
      <MsResultsModal
        gameStatus={statuses.GAME_OVER}
        repeatGame={jest.fn()}
        resetGame={jest.fn()}
      />
    );
    expect(getByText(/game over/i)).toBeTruthy();

    // expect to not see any text while the game is in progress
    rerender(
      <MsResultsModal
        gameStatus={statuses.GAME_IN_PROGRESS}
        repeatGame={jest.fn()}
        resetGame={jest.fn()}
      />
    );
    expect(queryByText(/You won/i)).toBeFalsy();
    expect(queryByText(/game over/i)).toBeFalsy();
  });
});
