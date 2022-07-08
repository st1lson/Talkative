import React from 'react';
import classes from './Input.module.scss';

const Input = ({ label, labelColor, name, ...otherProps }) => (
    <>
        <div className={classes.InputWrapper}>
            {label ? (
                <label style={{ color: labelColor }} htmlFor={name}>
                    {label}
                </label>
            ) : null}
            <input name={name} {...otherProps} />
        </div>
    </>
);

export default Input;
