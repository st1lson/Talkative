import React from 'react';
import { Link } from 'react-router-dom';
import authToken from '../../global/js/authToken';
import './NavBar.module.scss';

const NavBar = props => {
    const { onLogout } = props;

    const menu = authToken?.valid() ? (
        <li>
            <Link
                to="/auth"
                onClick={onLogout}
                style={{
                    color: '#fff',
                    textDecoration: 'none',
                }}>
                Logout
            </Link>
        </li>
    ) : null;

    return (
        <nav>
            <h1>Talkative</h1>
            <ul>
                {menu}
            </ul>
        </nav>
    );
};

export default NavBar;
