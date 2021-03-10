import { MessagesActionType } from '@/_types';

interface State {
    messages: string[],
}

interface Action {
    type: string,
    messageText: string,
}

export function Messages(state: State = { messages: [] }, action: Action) {
    switch (action.type) {
        case MessagesActionType.ADD:
            const messages = [...state.messages];
            messages.push(action.messageText);
            
            return { messages };

        case MessagesActionType.DELETE:
            return { messages: [] };

        default:
            return { messages: [] };
    }
}