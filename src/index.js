import React from 'react';
import { injectGlobal } from 'emotion';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';

injectGlobal`
  * {
    box-sizing: border-box;
  }
   
  html,
  body,
  #root {
    font-family: 'Lato', sans-serif;
    height: 100%;
    font-size: 14px;
    color: #888;
    margin: 0;
    padding: 0;
  }
  
  button {
    border: none;
    background: transparent;
    box-shadow: none;
    text-shadow: none;
    padding: 0;
    margin: 0;
    box-sizing: border-box;
    cursor: pointer;
    font-size: inherit;
  }
`;

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
