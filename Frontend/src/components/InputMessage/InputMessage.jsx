import React from 'react';
import classes from './InputMessage.module.scss';
import { RiSendPlaneFill } from 'react-icons/ri';

const InputMessage = ({ name, onClick, ...otherProps }) => (
    <>
        <div className={classes.InputWrapper}>
            <input name={name} {...otherProps} />
            <button onClick={onClick}>
                <RiSendPlaneFill />
            </button>
        </div>
    </>
);

export default InputMessage;
