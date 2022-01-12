import React, { PureComponent } from 'react';
import ChatBox from '../../components/ChatBox/ChatBox';
import classes from './Chat.module.scss';

export default class Chat extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            messages: [{ username: '1' }, { username: '2' }, { username: '3' }],
            username: '1',
        };
    }

    render() {
        const { messages, username } = this.state;

        return (
            <div className={classes.MessagesContainer}>
                {messages.map(m => {
                    let user = 'another-user';
                    if (m.username === username) {
                        user = 'user';
                    }

                    return (
                        <ChatBox
                            user={user}
                            message="Hello world"
                            time="2022-01-01"
                            username="Eternity"
                        />
                    );
                })}
            </div>
        );
    }
}
