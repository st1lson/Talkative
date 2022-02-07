import React, { Component } from 'react';
import graphql from '../../global/js/graphql';
import axiosGQLInstance from '../../global/js/axiosGQLInstance';
import GroupBox from '../../components/GroupBox/GroupBox';
import Chat from '../Chat/Chat';
import classes from './GroupList.module.scss';
import NoContentBox from '../../components/NoContentBox/NoContentBox';

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

    selectChat = groupId => {
        this.setState({ selectedGroup: groupId });
    };

    delteChat = groupId => {
        // delete method
    }

    putChat = (groupId, name) => {
        axiosGQLInstance
            .post('/', { query: graphql.putGroup(groupId, name) })
            .catch(err => {
                console.log(err);
            });
    }

    render() {
        const { groups, selectedGroup } = this.state;

        return (
            <div className={classes.Wrapper}>
                <div className={classes.GroupsContainer}>
                    {groups.length ? (
                        groups.map(g => (
                            <GroupBox
                                key={g.id}
                                group={g}
                                selected={selectedGroup === g.id}
                                onClick={this.selectChat}
                                onDelete={this.delteChat}
                                onPut={this.putChat}
                            />
                        ))
                    ) : (
                        <NoContentBox>There are no groups yet.</NoContentBox>
                    )}
                </div>
                <div className={classes.ChatContainer}>
                    <Chat groupId={selectedGroup} />
                </div>
            </div>
        );
    }
}
