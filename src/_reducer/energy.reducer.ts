import { EnergyStateType } from '@/_types';

enum KarmaType {
    INIT = 'init',
    DEC = 'dec',
}

interface ActionType {
    type: string,
}

export function Energy(state: EnergyStateType = {qty: 0}, action: ActionType) {
    switch (action.type) {
        case KarmaType.INIT:
            return {qty: 1};
    
        default:
            return state;
    }
}