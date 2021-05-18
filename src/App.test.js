import React from 'react';
import { render } from '@testing-library/react';
import CoCo from './js/CoCo.jsx';

test('renders learn react link', () => {
  const { getByText } = render(<CoCo />);
  const linkElement = getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
