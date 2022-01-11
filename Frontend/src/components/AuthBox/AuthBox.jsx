import React from 'react';
import classes from './AuthBox.module.scss';

const AuthBox = props => {
    const { children } = props;

    return <div className={classes.Wrapper}>{children}</div>;
};

export default AuthBox;
