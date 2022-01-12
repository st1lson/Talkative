import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import AuthBox from '../../../components/AuthBox/AuthBox';
import Button from '../../../components/Button/Button';
import Input from '../../../components/Input/Input';
import authToken from '../../../global/js/authToken';
import axiosRESTInstance from '../../../global/js/axiosRESTInstance';
import credentials from '../../../global/js/credentials';

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            isLoading: false,
        };
    }

    onLoginClick = () => {
        const { username, password } = this.state;

        const { onLogin } = this.props;

        this.setState({ isLoading: true });

        axiosRESTInstance
            .post('/auth/login', { username, password })
            .then(res => {
                const { jwtToken, userName } = res.data;

                credentials.set(userName);
                authToken.set(jwtToken);

                onLogin();
            })
            .finally(() => this.setState({ isLoading: false }));
    };

    onInputChange = e => {
        const { name, value } = e.target;

        this.setState({
            [name]: value,
        });
    };

    render() {
        const { username, password } = this.state;

        return (
            <AuthBox onClick={this.onLoginClick}>
                <Input
                    label="Enter a username"
                    value={username}
                    type="text"
                    name="username"
                    onChange={this.onInputChange}
                />
                <Input
                    label="Enter a password"
                    value={password}
                    type="password"
                    name="password"
                    onChange={this.onInputChange}
                />
                <Button onClick={this.onLoginClick}>Login</Button>
                <div className="ToRegister">
                    <Link
                        to="/register"
                        style={{
                            color: '#000',
                        }}>
                        Create new account
                    </Link>
                </div>
            </AuthBox>
        );
    }
}
