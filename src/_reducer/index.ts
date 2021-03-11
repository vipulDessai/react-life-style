import { combineReducers } from 'redux';

import { Energy } from './energy.reducer';
import { Messages } from './messages.reducer';

export const rootReducer = combineReducers({
    Energy,
    Messages,
});

export type RootState = ReturnType<typeof rootReducer>;