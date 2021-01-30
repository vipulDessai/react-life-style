import React from 'react';
import { render, screen } from '@testing-library/react';

import { App } from '@/App';

// svg icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
library.add( faTrash, faTimesCircle );

describe('Render', () => {
  test('App', () => {
    render(
      <App />
    );

    expect(
      screen.getByRole('heading', {
        name: /app/i
      })
    ).toHaveTextContent('App');
  });
});