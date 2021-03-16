import { MessagesActionType } from '@/_types';

interface State {
    message: string,
}

interface Action {
    type: string,
    messageText: string,
}

export function Messages(state: State = { message: '' }, action: Action) {
    switch (action.type) {
        case MessagesActionType.ADD:
            return { message: action.messageText };

        case MessagesActionType.DELETE:
            return { message: '' };

        default:
            return state;
    }
}