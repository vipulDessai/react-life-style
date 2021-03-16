import { combineReducers } from 'redux';

import { DarkStone } from './darkStone.reducer';
import { Messages } from './messages.reducer';
import { LifeCycleLogs } from './lifeCycleLogs.reducer';
import { Pokemons } from './pokemons.reducer';

export const rootReducer = combineReducers({
    DarkStone,
    Messages,
    LifeCycleLogs,
    Pokemons
});

export type RootState = ReturnType<typeof rootReducer>;