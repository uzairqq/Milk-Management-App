import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router-dom';
import DefaultLayout from '../DefaultLayout';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><DefaultLayout /></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
