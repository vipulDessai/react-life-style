import { combineReducers } from 'redux';

import { DarkStone } from './darkStone.reducer';
import { Messages } from './messages.reducer';
import { LifeCycleLogs } from './lifeCycleLogs.reducer';

export const rootReducer = combineReducers({
    DarkStone,
    Messages,
    LifeCycleLogs,
});

export type RootState = ReturnType<typeof rootReducer>;