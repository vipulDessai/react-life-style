import { MessagesActions } from '@/_types';

interface State {
    message: string,
}

interface Action {
    type: string,
    data: string,
}

export function Messages(state: State = { message: '' }, action: Action) {
    switch (action.type) {
        case MessagesActions.ADD_MESSAGE:
            return { message: action.data };

        case MessagesActions.DELETE_MESSAGE:
            return { message: '' };

        default:
            return state;
    }
}