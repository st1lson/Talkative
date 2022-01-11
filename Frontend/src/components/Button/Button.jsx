import React from 'react';
import classes from './Button.module.scss';

const Button = props => {
    const { onClick, children } = props;

    return (
        <button className={classes.CustomButton} onClick={onClick}>
            {children}
        </button>
    );
};

export default Button;
