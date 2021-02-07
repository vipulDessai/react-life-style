import { combineReducers } from 'redux';

import { karma } from './karmaReducer';

export const rootReducer = combineReducers({
    karma,
});

export type RootState = ReturnType<typeof rootReducer>;