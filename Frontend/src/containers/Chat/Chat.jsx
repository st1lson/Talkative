import React, { PureComponent } from 'react';
import credentials from '../../global/js/credentials';
import ChatBox from '../../components/ChatBox/ChatBox';
import classes from './Chat.module.scss';
import axiosGQLInstance from '../../global/js/axiosGQLInstance';
import graphql from '../../global/js/graphql';
import InputMessage from '../../components/InputMessage/InputMessage';

export default class Chat extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            username: credentials.get().username,
            isLoading: false,
        };
    }

    componentDidMount() {
        this.getMessages();
    }

    getMessages() {
        let { messages } = this.state;

        this.setState({ isLoading: true });

        axiosGQLInstance
            .post('/', { query: graphql.getMessages })
            .then(res => {
                messages = res.data.data.message;

                this.setState({ messages });
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => this.setState({ isLoading: false }));
    }

    createMessage = () => {
        const { newMessage } = this.state;

        this.setState({ isLoading: true });

        axiosGQLInstance
            .post('/', { query: graphql.addMessage(newMessage) })
            .then(res => {
                console.log(newMessage);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => this.setState({ newMessage: '', isLoading: false }));
    };

    onInputChange = e => {
        const { name, value } = e.target;

        this.setState({
            [name]: value,
        });
    };

    render() {
        const { messages, username } = this.state;

        return (
            <>
                <div className={classes.MessagesContainer}>
                    {messages.map(m => {
                        let user = 'another-user';
                        if (m.userName === username) {
                            user = 'user';
                        }

                        return (
                            <ChatBox
                                user={user}
                                key={m.id}
                                message={m.text}
                                time={m.date}
                                username={m.userName}
                            />
                        );
                    })}
                </div>
                <InputMessage
                    placeholder="Input here your message"
                    name="newMessage"
                    onChange={this.onInputChange}
                    onClick={this.createMessage}
                />
            </>
        );
    }
}
