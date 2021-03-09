import React, {Component, createContext} from 'react';

export const MultiverseContext = createContext({
    createEnergy: () => {},
    consumeEnergy: () => {},
    energy: -1,
});

export class MultiverseContextProvider extends Component {
    state = {
        energy: 0,
    }
    createEnergy = () => {
        this.setState({ energy: 1 });
    }
    consumeEnergy = () => {
        this.setState({ energy: 0 });
    }
    render() {
        return (
            <MultiverseContext.Provider value={{ ...this.state, createEnergy: this.createEnergy, consumeEnergy: this.consumeEnergy }}>
                {this.props.children}
            </MultiverseContext.Provider>
        );
    }
}