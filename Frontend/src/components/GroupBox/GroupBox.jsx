import React, { useState } from 'react';
import { FiEdit2, FiDelete } from 'react-icons/fi';
import credentials from '../../global/js/credentials';
import ContextMenu from '../ContextMenu/ContextMenu';
import dayjs from 'dayjs';
import classes from './GroupBox.module.scss';

const GroupBox = props => {
    const { group, selected, onClick, onDelete, onPut } = props;

    const [state, setState] = useState({
        xPos: '0px',
        yPos: '0px',
        showMenu: false,
    });

    if (group?.lastMessage?.userName === credentials.get().username) {
        group.lastMessage.userName = 'You';
    }

    const groupRef = React.createRef();

    const onContextMenu = e => {
        e.preventDefault();

        if (
            !groupRef ||
            !groupRef.current.contains(e.target) ||
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
            className={`${classes.Wrapper}  ${
                selected ? classes.active : null
            }`}
            role="button"
            onClick={() => {
                if (selected) {
                    return;
                }

                onClick(group.id);
            }}
            onContextMenu={onContextMenu}
            ref={groupRef}>
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
                                onPut(group.id, 'new name here');
                            }}>
                            <div className={classes.IconWrapper}>
                                <FiEdit2 />
                            </div>
                            Rename
                        </div>
                        <div
                            tabIndex="0"
                            className={classes.PopupMenuElement}
                            delete="true"
                            role="button"
                            onClick={() => {
                                setState(prev => ({
                                    ...prev,
                                    showMenu: false,
                                }));
                                onDelete(group.id);
                            }}>
                            <div className={classes.IconWrapper}>
                                <FiDelete />
                            </div>
                            Leave
                        </div>
                    </div>
                </ContextMenu>
            ) : null}
            <div className={classes.GroupNameContainer}>
                <span>{group.name}</span>
            </div>
            <div className={classes.LastMessageContainer}>
                <span
                    className={
                        classes.LastMessage
                    }>{`${group?.lastMessage?.userName}:
                     ${group?.lastMessage?.text}`}</span>
                <span className={classes.MessageDate}>
                    {dayjs(group?.lastMessage?.date).format('MMMM D, YYYY')}
                </span>
            </div>
        </div>
    );
};

export default GroupBox;
