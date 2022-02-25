import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import {createGlobalStyle} from "styled-components"

const GlobalStyle = createGlobalStyle `
  body {
    margin:0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen"
  }

  html, body, #root {
    height: 100%
  }
`

ReactDOM.render(
  <React.StrictMode>
    <>
    <GlobalStyle/>
    <App />
    </>
  </React.StrictMode>,
  document.getElementById('root')
);


