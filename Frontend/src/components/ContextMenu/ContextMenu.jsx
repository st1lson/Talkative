import React from 'react';
import Backdrop from '../Backdrop/Backdrop';
import classes from './ContextMenu.module.scss';

const ContextMenu = props => {
    const { xPos, yPos, children, onClick } = props;

    return (
        <>
            <Backdrop onClick={onClick} />
            <div
                className={classes.ContextMenu}
                style={{
                    top: yPos,
                    left: xPos,
                }}>
                <ul>{children}</ul>
            </div>
        </>
    );
};

export default ContextMenu;
