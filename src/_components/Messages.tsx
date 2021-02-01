import React, { Component } from 'react';

interface PropsType {
    messages: string[]
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
            <ul>
                {
                    this.props.messages.map(
                        (message, index) => <li key={index}>{message}</li>
                    )
                }
            </ul>
        );
    }
}