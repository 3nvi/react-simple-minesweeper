// A simple wrapper for all redux actions. Makes it easy to add additional
// keys or logic in the future, making sure that it is applied on all actions
export const simpleAction = (type, payload = {}) => ({ type, payload });
