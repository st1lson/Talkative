import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import './NavBar.module.scss';

const NavBar = props => {
    const { onLogout } = props;

    return (
        <nav>
            <ul>
                <li>
                    <Link
                        to="/auth"
                        onClick={onLogout}
                        style={{
                            color: '#fff',
                            textDecoration: 'none',
                        }}>
                        <FiLogOut size="50%" />
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
