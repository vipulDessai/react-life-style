import React, {Component, createContext} from 'react';

interface MultiverseContextType {
    energy: number,
    messages: string[],
    createEnergy: () => void,
    consumeEnergyCreatePlanet: () => void,
    addMessage: (messageText: string) => void,
    deleteMessages: () => void,
}

export const MultiverseContext = createContext<Partial<MultiverseContextType>>({});

export class MultiverseContextProvider extends Component {
    state : {
        energy: number,
        messages: string[],
    } = {
        energy: 0,
        messages: [],
    }

    createEnergy = () => {
        this.setState({ energy: 1 });
    }
    consumeEnergyCreatePlanet = () => {
        this.setState({ energy: 0 });
    }
    addMessage = (messageText: string) => {
        const messages = [...this.state.messages];
        messages.push(messageText);
        this.setState({ messages });
    }
    deleteMessages = () => {
        this.setState({ messages: [] });
    }

    render() {
        return (
            <MultiverseContext.Provider value={{ ...this.state, createEnergy: this.createEnergy, consumeEnergyCreatePlanet: this.consumeEnergyCreatePlanet }}>
                {this.props.children}
            </MultiverseContext.Provider>
        );
    }
}