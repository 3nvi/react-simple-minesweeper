export const GAME_STATUSES = {
  // Initial screen where a user selects the width,height & mines of the game
  GAME_SELECTION: 'GAME_SELECTION',

  // When the user plays the game (hasn't won or lost yet)
  GAME_IN_PROGRESS: 'IN_PROGRESS',

  // When the user has finished the game and he has won
  GAME_WON: 'WON',

  // When the user has finished the game and he has lost
  GAME_OVER: 'GAME_OVER',
};

// The size of each grid cell (in pixels)
export const GRID_CELL_SIZE = 25;

// The height of the Modal (in pixels)
export const RESULTS_MODAL_HEIGHT = 75;
