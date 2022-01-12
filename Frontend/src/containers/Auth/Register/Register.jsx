import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Input from '../../../components/Input/Input';
import Button from '../../../components/Button/Button';
import AuthBox from '../../../components/AuthBox/AuthBox';
import authToken from '../../../global/js/authToken';
import axiosRESTInstance from '../../../global/js/axiosRESTInstance';
import credentials from '../../../global/js/credentials';

export default class Register extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            confirmPassword: '',
            isLoading: false,
        };
    }

    onRegisterClick = () => {
        const { username, email, password, confirmPassword } = this.state;
        const { onLogin } = this.props;

        if (password !== confirmPassword) {
            return;
        }

        this.setState({ isLoading: true });

        axiosRESTInstance
            .post('/auth/register', { username, email, password })
            .then(res => {
                const { jwtToken, username } = res.data;

                credentials.set(username);
                authToken.set(jwtToken);

                onLogin();
            })
            .finally(() => this.setState({ isLoading: false }));
    };

    onInputChange = e => {
        const { name, value } = e.target;

        this.setState({ [name]: value });
    };

    render() {
        const { username, email, password, confirmPassword } = this.state;

        return (
            <AuthBox>
                <Input
                    label="Create your unique username"
                    value={username}
                    type="text"
                    name="username"
                    onChange={this.onInputChange}
                />
                <Input
                    label="Enter your email address below"
                    value={email}
                    type="text"
                    name="email"
                    onChange={this.onInputChange}
                />
                <Input
                    label="Enter your password below"
                    value={password}
                    type="password"
                    name="password"
                    onChange={this.onInputChange}
                />
                <Input
                    label="Confirm your password"
                    value={confirmPassword}
                    type="password"
                    name="confirmPassword"
                    onChange={this.onInputChange}
                />
                <Button onClick={this.onRegisterClick}>Register</Button>
                <div className="ToLogin">
                    <Link
                        to="/login"
                        style={{
                            color: '#000',
                        }}>
                        I already have an account
                    </Link>
                </div>
            </AuthBox>
        );
    }
}
