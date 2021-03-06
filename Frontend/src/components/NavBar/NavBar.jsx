import React from 'react';
import { Link } from 'react-router-dom';
import { FiLogOut } from 'react-icons/fi';
import { CgProfile } from 'react-icons/cg';
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
                            textDecoration: 'none',
                        }}>
                        <CgProfile size="60%" />
                    </Link>
                </li>
                <li>
                    <Link
                        to="/auth"
                        onClick={onLogout}
                        style={{
                            textDecoration: 'none',
                        }}>
                        <FiLogOut size="60%" />
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NavBar;
