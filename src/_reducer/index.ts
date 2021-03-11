import { combineReducers } from 'redux';

import { DarkStone } from './darkStone.reducer';
import { Messages } from './messages.reducer';

export const rootReducer = combineReducers({
    DarkStone,
    Messages,
});

export type RootState = ReturnType<typeof rootReducer>;