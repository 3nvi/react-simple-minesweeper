import 'react-testing-library/cleanup-after-each';

if (!global.sleep) {
  global.sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
}
