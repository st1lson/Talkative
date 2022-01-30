import React, { Component } from 'react';
import graphql from '../../global/js/graphql';
import axiosGQLInstance from '../../global/js/axiosGQLInstance';
import GroupBox from '../../components/GroupBox/GroupBox';
import classes from './GroupList.module.scss';

export default class GroupList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groups: [],
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

    render() {
        const { groups } = this.state;

        return (
            <div className={classes.Wrapper}>
                {groups.map(g => (
                    <GroupBox
                        key={g.id}
                        group={g}
                        onDelete={() => console.log('delete')}
                        onPut={() => console.log('put')}
                    />
                ))}
            </div>
        );
    }
}
