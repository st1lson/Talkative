import React, { useState } from 'react';
import { FiEdit2, FiDelete } from 'react-icons/fi';
import classes from './ChatBox.module.scss';
import dayjs from 'dayjs';
import ContextMenu from '../ContextMenu/ContextMenu';

const ChatBox = props => {
    const { user, message, onDelete, onPut } = props;
    const [state, setState] = useState({
        xPos: '0px',
        yPos: '0px',
        showMenu: false,
    });

    const messageRef = React.createRef();

    const onContextMenu = e => {
        e.preventDefault();

        if (
            !messageRef ||
            !messageRef.current.contains(e.target) ||
            state.showMenu
        ) {
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
                <ContextMenu
                    xPos={state.xPos}
                    yPos={state.yPos}
                    onClick={() => {
                        setState(prev => ({
                            ...prev,
                            showMenu: false,
                        }));
                    }}>
                    <div className={classes.PopupMenu}>
                        <div
                            tabIndex="0"
                            className={classes.PopupMenuElement}
                            role="button"
                            onClick={() => {
                                setState(prev => ({
                                    ...prev,
                                    showMenu: false,
                                }));
                                onPut(message);
                            }}>
                            <div className={classes.IconWrapper}>
                                <FiEdit2 />
                            </div>
                            Edit
                        </div>
                        <div
                            tabIndex="0"
                            className={classes.PopupMenuElement}
                            role="button"
                            onClick={() => {
                                setState(prev => ({
                                    ...prev,
                                    showMenu: false,
                                }));
                                onDelete(message);
                            }}>
                            <div className={classes.IconWrapper}>
                                <FiDelete />
                            </div>
                            Delete
                        </div>
                    </div>
                </ContextMenu>
            ) : null}
            <div className={classes.UserNameContainer}>
                <span>{message.userName}</span>
            </div>
            <div className={classes.MessageContainer}>
                <span>{message.text}</span>
            </div>
            <div className={classes.DateContainer}>
                <span>{dayjs(message.date).format('YYYY-MM-DD hh:mm')}</span>
            </div>
        </div>
    );
};

export default ChatBox;
