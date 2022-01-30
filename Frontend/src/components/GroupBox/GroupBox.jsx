import React from 'react';
import classes from './GroupBox.module.scss';

const GroupBox = props => {
    const { group, onClick, onDelete, onPut } = props;

    return (
        <div className={classes.Wrapper} role="button" onClick={() => onClick(group)}>
            <div className={classes.GroupNameContainer}>
                <span>{group.name}</span>
            </div>
        </div>
    );
};

export default GroupBox;
