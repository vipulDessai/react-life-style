import { combineReducers } from 'redux';

import { Messages } from './messages.reducer';
import { LifeCycleLogs } from './life-cycle-logs.reducer';
import { Maker as Universe } from './maker.reducer';

export const rootReducer = combineReducers({
    Messages,
    LifeCycleLogs,
    Universe
});

export type RootState = ReturnType<typeof rootReducer>;