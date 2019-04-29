import PropTypes from 'prop-types';

/**
 * The prop-type shape of the data that each cell on the grid holds
 */
export default {
  neighbouringMines: PropTypes.oneOf([-1, 0, 1, 2, 3, 4, 5, 6, 7, 8]),
  index: PropTypes.number.isRequired,
  opened: PropTypes.bool.isRequired,
  fromUserActivity: PropTypes.bool,
  timestamp: PropTypes.number,
};
