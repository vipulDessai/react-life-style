import React, { Component } from 'react';

interface PropsType {
    messageText: string
}

export class Messages extends Component<PropsType> {
    componentDidMount() {
        console.log('Messages instantiated!!');
    }

    componentDidUpdate() {
        console.log('Messages updated!!');
    }

    componentWillUnmount() {
        console.log('Messages deleted!!');
    }

    render() {
        console.log('messages rendered!!');
        return (
            <p>{this.props.messageText}</p>
        );
    }
}