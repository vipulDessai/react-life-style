import { DarkStoneActionType, DarkStoneType } from '@/_types';

interface ActionType {
    type: string,
}

export function DarkStone(state: DarkStoneType = { ready: false }, action: ActionType) {
    switch (action.type) {
        case DarkStoneActionType.CREATE:
            return { ready: true };

        case DarkStoneActionType.CONSUME:
            return { ready: false };
    
        default:
            return state;
    }
}