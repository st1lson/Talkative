import React, { useState } from 'react';
import { FiEdit2, FiDelete } from 'react-icons/fi';
import ContextMenu from '../ContextMenu/ContextMenu';
import classes from './GroupBox.module.scss';

const GroupBox = props => {
    const { group, selected, onClick, onDelete, onPut } = props;

    const [state, setState] = useState({
        xPos: '0px',
        yPos: '0px',
        showMenu: false,
    });

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
                <span>{group?.messages?.edges[0]?.node?.text}</span>
            </div>
        </div>
    );
};

export default GroupBox;
