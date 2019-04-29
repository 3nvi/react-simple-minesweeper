import React from 'react';
import { render } from 'react-testing-library';
import { GAME_STATUSES as statuses } from 'utils/constants';
import MsTimer from './MsTimer';

describe('MsTimer', () => {
  it('properly formats time', () => {
    const { getByText } = render(
      <MsTimer elapsedTime={2000} gameStatus={statuses.GAME_IN_PROGRESS} tickGameTime={jest.fn()} />
    );
    expect(getByText('00:02')).toBeTruthy();
  });

  it('calls `tickGameTime` every second', async () => {
    const tickGameTimeMock = jest.fn();
    render(
      <MsTimer
        elapsedTime={2000}
        gameStatus={statuses.GAME_IN_PROGRESS}
        tickGameTime={tickGameTimeMock}
      />
    );

    // wait for the first tick
    await window.sleep(1000);
    expect(tickGameTimeMock.mock.calls.length).toEqual(1);

    // validate the 2nd tick
    await window.sleep(1000);
    expect(tickGameTimeMock.mock.calls.length).toEqual(2);
  });

  it('stops ticking if the status changes', async () => {
    const tickGameTimeMock = jest.fn();
    const { rerender } = render(
      <MsTimer
        elapsedTime={2000}
        gameStatus={statuses.GAME_IN_PROGRESS}
        tickGameTime={tickGameTimeMock}
      />
    );

    // wait for the first tick
    await window.sleep(1000);
    expect(tickGameTimeMock.mock.calls.length).toEqual(1);

    // change the props
    rerender(
      <MsTimer elapsedTime={3000} gameStatus={statuses.GAME_OVER} tickGameTime={tickGameTimeMock} />
    );

    // expect to not tick any more (remain 1)
    await window.sleep(1000);
    expect(tickGameTimeMock.mock.calls.length).toEqual(1);
  });

  it('stops ticking if it gets unmounted', async () => {
    const tickGameTimeMock = jest.fn();
    const { unmount } = render(
      <MsTimer
        elapsedTime={2000}
        gameStatus={statuses.GAME_IN_PROGRESS}
        tickGameTime={tickGameTimeMock}
      />
    );

    // wait for the first tick
    await window.sleep(1000);
    expect(tickGameTimeMock.mock.calls.length).toEqual(1);

    // unmount the React Component
    unmount();

    // expect to not tick any more (remain 1)
    await window.sleep(1000);
    expect(tickGameTimeMock.mock.calls.length).toEqual(1);
  });
});
