import React from 'react';
import classes from './ChatBox.module.scss';
import dayjs from 'dayjs';

const ChatBox = props => {
    const { user, message, time, username } = props;

    return (
        <div className={classes.Wrapper} user={user}>
            <div className={classes.UserNameContainer}>
                <span>{username}</span>
            </div>
            <div className={classes.MessageContainer}>
                <span>{message}</span>
            </div>
            <div className={classes.DateContainer}>
                <span>{dayjs(time).format('YYYY-MM-DD h:m')}</span>
            </div>
        </div>
    );
};

export default ChatBox;
