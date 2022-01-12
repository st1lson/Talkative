import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/Button/Button';
import authToken from '../../global/js/authToken';
import axiosRESTInstance from '../../global/js/axiosRESTInstance';
import credentials from '../../global/js/credentials';
import classes from './Layout.module.scss';

const Layout = props => {
    const { children } = props;

    const handleLogout = () => {
        const { onLogout } = props;
        axiosRESTInstance.post('auth/logout').then(res => {
            authToken.remove();
            credentials.remove();
            onLogout();
        });
    };

    const isAuthenticated = authToken.valid();

    const logout = isAuthenticated ? (
        <div className={classes.Logout}>
            <Button>
                <Link
                    to="/auth"
                    onClick={handleLogout}
                    style={{
                        color: '#fff',
                        fontSize: '1.33rem',
                        textDecoration: 'none',
                    }}>
                    Logout
                </Link>
            </Button>
        </div>
    ) : null;

    return (
        <div className={classes.Wrapper}>
            {logout}
            <main>{children}</main>
        </div>
    );
};

export default Layout;
