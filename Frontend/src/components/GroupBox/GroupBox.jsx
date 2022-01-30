import React from 'react';
import classes from './GroupBox.module.scss';

const GroupBox = props => {
    const { group, onDelete, onPut } = props;

    return (
        <div className={classes.Wrapper}>
            <div className={classes.GroupNameContainer}>
                <span>{group.name}</span>
            </div>
        </div>
    );
};

export default GroupBox;
