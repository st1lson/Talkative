import React from 'react';
import classes from './InputMessage.module.scss';
import { RiSendPlaneFill } from 'react-icons/ri';

const InputMessage = ({ name, onClick, ...otherProps }) => {
    const handleKeyInput = e => {
        if (e.key === 'Enter') {
            onClick();
        }
    };

    return (
        <>
            <div className={classes.InputWrapper}>
                <input
                    autoComplete="off"
                    name={name}
                    onKeyDown={handleKeyInput}
                    {...otherProps}
                />
                <button onClick={onClick}>
                    <RiSendPlaneFill />
                </button>
            </div>
        </>
    );
};

export default InputMessage;
