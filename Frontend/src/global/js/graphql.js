import authToken from './authToken';

const graphql = {
    getMessages: groupId => `
    query {
        message (
            where: { groupId: {eq: ${groupId}} },
            order: { date: ASC }) {
                id
                text
                date
                userName
        }
    }`,
    getGroups: `
    query {
        group {
            id
            name
            messages(last: 1) {
                edges{
                    node {
                        text
                    }
                }
            }
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
            groupId: ${groupId},
            name: "${name}"
        })
        {
            group {
                id
                name
            }
        }
    }`,
    deleteMessage: (groupId, id) => `
    mutation {
        deleteMessage(input: {
            groupId: ${groupId},
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
    onMessagesChangeSubscription: groupId => `
    subscription {
        onMessagesChange(
            groupId: ${groupId}, 
            jwtToken: "${authToken.get()?.token}"
        )
        {
            messages {
                id
                text
                date
                groupId
                userName
            }
        }
    }`,
};

export default graphql;
