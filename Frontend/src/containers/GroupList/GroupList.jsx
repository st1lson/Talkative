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
    }

    getGroups = () => {
        axiosGQLInstance
            .post('/', { query: graphql.getGroups })
            .then(() => {
                this.setState({
                    isLoading: false,
                    newMessage: '',
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
                        group={g}
                        onDelete={() => console.log('delete')}
                        onPut={() => console.log('put')}
                    />
                ))}
            </div>
        );
    }
}
