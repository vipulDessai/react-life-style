import { MessagesActionType } from '@/_types';

interface State {
    messages: string[],
}

interface Action {
    type: string,
    messageText: string,
}

export function Messages(state: State = { messages: [] }, action: Action) {
    const messages = [...state.messages];
    switch (action.type) {
        case MessagesActionType.ADD:
            messages.push(action.messageText);
            
            return { messages };

        case MessagesActionType.DELETE:
            return { messages: [] };

        default:
            return state;
    }
}