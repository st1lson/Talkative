import React, { useState } from 'react';
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    useSubscription,
    gql,
    createHttpLink,
    split,
} from '@apollo/client';
import { withRouter } from 'react-router';
import { WebSocketLink } from '@apollo/client/link/ws';
import { setContext } from '@apollo/client/link/context';
import { getMainDefinition } from '@apollo/client/utilities';
import credentials from '../../global/js/credentials';
import authToken from '../../global/js/authToken';
import ChatBox from '../../components/ChatBox/ChatBox';
import classes from './Chat.module.scss';
import axiosGQLInstance from '../../global/js/axiosGQLInstance';
import graphql from '../../global/js/graphql';
import InputMessage from '../../components/InputMessage/InputMessage';

const wsLink = new WebSocketLink({
    uri: 'wss://localhost:5001/graphql',
    options: {
        reconnect: true,
    },
});

const httpLink = createHttpLink({
    uri: 'https://localhost:5001/graphql',
});

const authLink = setContext((_, { headers }) => {
    const { token } = authToken.get();
    if (!token) {
        return;
    }

    return {
        headers: {
            ...headers,
            authorization: `Bearer ${token}`,
        },
    };
});

const link = split(
    ({ query }) => {
        const { kind, operation } = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink),
);

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link,
});

const Chat = props => {
    const [state, setState] = useState({
        messages: [],
        username: credentials.get()?.username,
        lastElement: null,
        newMessage: '',
        selectedGroup: 0,
        isLoading: false,
        isEdit: false,
    });
    const { groupId } = props;

    const subscriptions = gql`
        ${graphql.onMessagesChangeSubscription(groupId)}
    `;

    const { data } = useSubscription(subscriptions);

    const scrollToBottom = () => {
        state.lastElement?.scrollIntoView({ behavior: 'smooth' });
    };

    if (groupId !== state.selectedGroup) {
        setState(prev => ({
            ...prev,
            selectedGroup: groupId,
        }));

        axiosGQLInstance
            .post('/', { query: graphql.getMessages(groupId) })
            .then(res => {
                if (!res.data.data.message) {
                    return;
                }

                setState(prev => ({
                    ...prev,
                    messages: res.data.data.message,
                }));
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setState(prev => ({ ...prev, isLoading: false })));
    }

    if (data && data.onMessagesChange.messages !== state.messages) {
        setState(prev => ({
            ...prev,
            messages: data.onMessagesChange.messages,
        }));
    }

    const deleteMessage = element => {
        setState(prev => ({ ...prev, isLoading: true }));

        axiosGQLInstance
            .post('/', { query: graphql.deleteMessage(groupId, element.id) })
            .then(res => console.log(res.data))
            .catch(err => {
                console.log(err);
            });
    };

    const putMessage = () => {
        const { messageToPut, newMessage } = state;

        setState(prev => ({ ...prev, isLoading: true }));

        axiosGQLInstance
            .post('/', {
                query: graphql.putMessage(groupId, messageToPut.id, newMessage),
            })
            .then(res => console.log(res.data))
            .catch(err => {
                console.log(err);
            });
    };

    const createMessage = () => {
        const { newMessage } = state;

        setState(prev => ({ ...prev, isLoading: true }));

        axiosGQLInstance
            .post('/', { query: graphql.addMessage(groupId, newMessage) })
            .then(() => {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    newMessage: '',
                }));
            })
            .catch(err => {
                console.log(err);
            });
    };

    const handleInput = () => {
        const { isEdit } = state;

        isEdit ? putMessage() : createMessage();
    };

    const handlePut = element => {
        setState(prev => ({
            ...prev,
            isEdit: true,
            messageToPut: element,
            newMessage: element.text,
        }));

        document.getElementById('newMessage').focus();
    };

    const onInputChange = e => {
        const { name, value } = e.target;

        setState(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const { newMessage, messages, username } = state;

    scrollToBottom();
    return (
        <div className={classes.Wrapper}>
            <div className={classes.MessagesContainer}>
                {messages
                    ? messages.map(m => {
                        let user = 'another-user';
                        if (m.userName === username) {
                            user = 'user';
                        }

                        return (
                            <ChatBox
                                user={user}
                                key={m.id}
                                message={m}
                                onDelete={deleteMessage}
                                onPut={handlePut}
                            />
                        );
                    })
                    : null}
                <div
                    style={{ float: 'left', clear: 'both' }}
                    ref={el => {
                        if (el === state.lastElement) {
                            return;
                        }

                        setState(prev => ({
                            ...prev,
                            lastElement: el,
                        }));
                    }}></div>
            </div>
            <InputMessage
                id="newMessage"
                placeholder="Write a message..."
                value={newMessage}
                type="text"
                name="newMessage"
                onChange={onInputChange}
                onClick={handleInput}
            />
        </div>
    );
};

export default withRouter(props => (
    <ApolloProvider client={client}>
        <Chat groupId={props.groupId} />
    </ApolloProvider>
));
