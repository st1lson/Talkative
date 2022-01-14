import React from 'react';
import NavBar from '../../components/NavBar/NavBar';
import authToken from '../../global/js/authToken';
import axiosRESTInstance from '../../global/js/axiosRESTInstance';
import credentials from '../../global/js/credentials';
import classes from './Layout.module.scss';

const Layout = props => {
    const { children } = props;

    const handleLogout = () => {
        const { onLogout } = props;
        axiosRESTInstance.post('auth/logout').then(() => {
            authToken.remove();
            credentials.remove();
            onLogout();
        });
    };

    return (
        <div className={classes.Wrapper}>
            <NavBar onLogout={handleLogout} />
            <main>{children}</main>
        </div>
    );
};

export default Layout;
