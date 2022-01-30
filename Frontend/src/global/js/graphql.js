import authToken from './authToken';

const graphql = {
    getMessages: groupId => `
    query {
        message (
            where: { groupId: ${groupId} },
            order: { date: ASC }) {
                id
                text
                userName
        }
    }`,
    getGroups: `
    query {
        group {
            id
            name
        }
    }`,
    addMessage: (groupId, message) => `
    mutation {
        addMessage(input: {
            groupId: ${groupId},
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
    addGroup: name => `
    mutation {
        addGroup(input: {
            name: "${name}"
        })
        {
            group {
                name
                creatorId
            }
        }
    }`,
    putMessage: (groupId, id, message) => `
    mutation {
        putMessage(input: {
            groupId: ${groupId},
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
    putGroup: (groupId, name) => `
    mutation {
        putGroup(input: {
            groupId:: ${groupId},
            name: "${name}"
        })
        {
            group {
                id
                name
            }
        }
    }`,
    deleteMessage: id => `
    mutation {
        deleteMessage(input: {
            groupId: 1,
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
            messages {
                id
                text
                date
                userName
            }
        }
    }`,
};

export default graphql;
