import React, { PureComponent } from 'react';
import ChatBox from '../../components/ChatBox/ChatBox';
import classes from './Chat.module.scss';

export default class Chat extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            messages: [{ userId: '1' }, { userId: '2' }, { userId: '3' }],
            userId: '1',
        };
    }

    render() {
        const { messages, userId } = this.state;

        return (
            <div className={classes.MessagesContainer}>
                {messages.map(m => {
                    let user = 'another-user';
                    if (m.userId === userId) {
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
