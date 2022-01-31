import React, { Component } from 'react';
import graphql from '../../global/js/graphql';
import axiosGQLInstance from '../../global/js/axiosGQLInstance';
import GroupBox from '../../components/GroupBox/GroupBox';
import Chat from '../Chat/Chat';
import classes from './GroupList.module.scss';

export default class GroupList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
            selectedGroup: 0,
        };

        this.getGroups();
    }

    getGroups = () => {
        axiosGQLInstance
            .post('/', { query: graphql.getGroups })
            .then(res => {
                if (!res.data.data.group) {
                    return;
                }

                this.setState({
                    groups: res.data.data.group,
                });
            })
            .catch(err => {
                console.log(err);
            });
    };

    selectChat = group => {
        this.setState({ selectedGroup: group.id });
    };

    render() {
        const { groups, selectedGroup } = this.state;
        console.log(selectedGroup);

        return (
            <div className={classes.Wrapper}>
                <div className={classes.GroupsContainer}>
                    {groups.map(g => (
                        <GroupBox
                            key={g.id}
                            group={g}
                            onClick={this.selectChat}
                            onDelete={() => console.log('delete')}
                            onPut={() => console.log('put')}
                        />
                    ))}
                </div>
                <div className={classes.ChatContainer}>
                    <Chat groupId={selectedGroup} />
                </div>
            </div>
        );
    }
}
