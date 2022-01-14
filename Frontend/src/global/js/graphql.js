import authToken from './authToken';

const graphql = {
    getMessages: `
    query {
        message (order: { date: ASC }) {
            id
            text
            date
            userName
        }
    }`,
    addMessage: message => `
    mutation {
        addMessage(input: { 
            text: "${message}"
        })
        {
            message {
                id
                text
                date
            }
        }
    }`,
    putMessage: (id, message) => `
    mutation {
        putMessage(input: {
            id: ${id},
            text: "${message}"
        })
        {
            message {
                id
                text
                date
            }
        }
    }`,
    deleteMessage: id => `
    mutation {
        deleteMessage(input: {
            id: ${id}
        })
        {
            message {
                id
                text
                date
            }
        }
    }`,
    onMessagesChangeSubscription: () => `
    subscription {
        onMessagesChange(jwtToken: "${authToken.get()?.token}")
        {
            messages (order: { date: ASC }) {
                id
                text
                date
                userName
            }
        }
    }`,
};

export default graphql;
