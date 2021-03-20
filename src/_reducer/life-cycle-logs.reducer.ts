enum Actions {
    ADD = 'ADD',
    CLEAR = 'CLEAR',
}

interface StateType {

}
interface ActionType {
    type: string,
}

export function LifeCycleLogs(state: StateType = {}, action: ActionType) {
    switch (action.type) {
        case Actions.ADD:
            return state;

        case Actions.CLEAR:
            return state;
    
        default:
            return state;
    }
}