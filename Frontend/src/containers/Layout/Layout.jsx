import React from 'react';
import classes from './Layout.module.scss';

const Layout = props => {
    const { children } = props;

    return (
        <div className={classes.Wrapper}>
            <main>{children}</main>
        </div>
    );
};

export default Layout;
