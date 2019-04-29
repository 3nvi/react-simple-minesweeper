const realModule = jest.requireActual('react');

module.exports = {
  ...realModule,
  useState: initialState => {
    const [state, setState] = realModule.useState(initialState);
    return [
      state,
      update => {
        require('react-dom/test-utils').act(() => {
          setState(update);
        });
      },
    ];
  },
  useReducer: (reducer, initialState) => {
    const [state, dispatch] = realModule.useReducer(reducer, initialState);
    return [
      state,
      update => {
        require('react-dom/test-utils').act(() => {
          dispatch(update);
        });
      },
    ];
  },
};
