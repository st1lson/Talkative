import React, { useState } from 'react';
import classes from './ChatBox.module.scss';
import dayjs from 'dayjs';
import ContextMenu from '../ContextMenu/ContextMenu';

const ChatBox = props => {
    const { user, message, time, username } = props;
    const [state, setState] = useState({
        xPos: '0px',
        yPos: '0px',
        showMenu: false,
    });

    const messageRef = React.createRef();

    const onContextMenu = e => {
        e.preventDefault();

        if (!messageRef || !messageRef.current.contains(e.target) || state.showMenu) {
            return;
        }

        setState(() => ({
            xPos: `${e.pageX}px`,
            yPos: `${e.pageY}px`,
            showMenu: true,
        }));
    };

    return (
        <div
            className={classes.Wrapper}
            user={user}
            onContextMenu={onContextMenu}
            ref={messageRef}>
            {state.showMenu ? (
                <ContextMenu xPos={state.xPos} yPos={state.yPos}
                    onClick={() => {
                        setState(prev => ({
                            ...prev,
                            showMenu: false,
                        }));
                    }}>
                    <li><a href='.'>a</a></li>
                    <li><a href='.'>b</a></li>
                </ContextMenu>
            ) : null}
            <div className={classes.UserNameContainer}>
                <span>{username}</span>
            </div>
            <div className={classes.MessageContainer}>
                <span>{message}</span>
            </div>
            <div className={classes.DateContainer}>
                <span>{dayjs(time).format('YYYY-MM-DD hh:mm')}</span>
            </div>
        </div>
    );
};

export default ChatBox;
