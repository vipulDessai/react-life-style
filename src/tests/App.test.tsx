import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import { App } from '@/App';

// svg icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
library.add( faTrash, faTimesCircle );

const mockStore = configureMockStore([thunk]);

describe('Render', () => {
  test('App', () => {
    const appInitialState = {
      karma: {
        qty: 0,
      }
    };
    const store = mockStore(appInitialState);
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    expect(
      screen.getByRole('heading', {
        name: /pokemon/i
      })
    ).toHaveTextContent('Pokemon');
  });
});