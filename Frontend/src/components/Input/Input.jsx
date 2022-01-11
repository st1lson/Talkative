import React from 'react';
import classes from './Input.module.scss';

const Input = ({ label, name, ...otherProps }) => (
    <>
        <div className={classes.InputWrapper}>
            {label ? <label htmlFor={name}>{label}</label> : null}
            <input name={name} {...otherProps} />
        </div>
    </>
);

export default Input;
