import React from 'react';
import classes from './NoContentBox.module.scss';

const NoContentBox = props => {
    const { children } = props;

    return <div className={classes.Wrapper}>{children}</div>;
};

export default NoContentBox;
