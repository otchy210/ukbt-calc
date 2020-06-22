import React from 'react';
import ReactDom from 'react-dom';
import Main from './components/Main';

console.log('main.js');

const wrapper = document.getElementById('react');

ReactDom.render(<Main />, wrapper);
