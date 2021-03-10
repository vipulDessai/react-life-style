import { combineReducers } from 'redux';

import { karma } from './karma.reducer';
import { Messages } from './messages.reducer';

export const rootReducer = combineReducers({
    karma,
    Messages,
});

export type RootState = ReturnType<typeof rootReducer>;