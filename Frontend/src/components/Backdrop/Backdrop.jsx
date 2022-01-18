import React from 'react';
import classes from './Backdrop.module.scss';

const Backdrop = props => {
    const { children, onClick } = props;

    return (
        <div className={classes.Backdrop} onClick={onClick}>
            <div className={classes.BackdropInner}>{children}</div>
        </div>
    );
};

export default Backdrop;
