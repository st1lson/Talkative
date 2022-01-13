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
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
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

const subscriptions = gql`
    ${graphql.onMessagesChangeSubscription()}
`;

const Chat = () => {
    const [state, setState] = useState({
        messages: [],
        username: credentials.get().username,
        isLoading: false,
    });

    const { data } = useSubscription(subscriptions);

    if (data && data.onMessagesChange.messages !== state.messages) {
        setState(prev => ({
            ...prev,
            messages: data.onMessagesChange.messages,
        }));
    }

    const getMessages = () => {
        let { messages } = state;

        setState(prev => ({ ...prev, isLoading: true }));

        axiosGQLInstance
            .post('/', { query: graphql.getMessages })
            .then(res => {
                messages = res.data.data.message;

                setState(prev => ({ ...prev, messages }));
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setState(prev => ({ ...prev, isLoading: false })));
    };

    const createMessage = () => {
        const { newMessage } = state;

        setState(prev => ({ ...prev, isLoading: true }));

        axiosGQLInstance
            .post('/', { query: graphql.addMessage(newMessage) })
            .then(res => {
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => setState(prev => ({ ...prev, isLoading: false })));
    };

    const onInputChange = e => {
        const { name, value } = e.target;

        setState(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const { messages, username } = state;
    console.log(messages);

    return (
        <>
            <div className={classes.MessagesContainer}>
                {messages.length
                    ? messages.map(m => {
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
                      })
                    : null}
            </div>
            <InputMessage
                placeholder="Input here your message"
                name="newMessage"
                onChange={onInputChange}
                onClick={createMessage}
            />
        </>
    );
};

export default withRouter(() => (
    <ApolloProvider client={client}>
        <Chat />
    </ApolloProvider>
));
