import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
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
                <FiLogOut size='30%' />
            </Link>
        </li>
    ) : null;

    return (
        <nav>
            <ul>
                {menu}
            </ul>
        </nav>
    );
};

export default NavBar;
