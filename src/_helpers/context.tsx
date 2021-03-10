import React, {Component, createContext} from 'react';

export const MultiverseContext = createContext({
    createEnergy: () => {},
    consumeEnergyCreatePlanet: () => {},
    energy: -1,
    messages: [],
});

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

    render() {
        return (
            <MultiverseContext.Provider value={{ ...this.state, createEnergy: this.createEnergy, consumeEnergyCreatePlanet: this.consumeEnergyCreatePlanet }}>
                {this.props.children}
            </MultiverseContext.Provider>
        );
    }
}