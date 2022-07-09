import { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Layout from './containers/Layout/Layout';
import Login from './containers/Auth/Login/Login';
import Register from './containers/Auth/Register/Register';
import authToken from './global/js/authToken';
import credentials from './global/js/credentials';
import GroupList from './containers/GroupList/GroupList';
import Profile from './containers/Profile/Profile';

export default class App extends Component {
    constructor(props) {
        super(props);

        if (!authToken.valid()) {
            credentials.remove();
            authToken.remove();
        }

        this.state = {
            user: credentials.get(),
            isAuthenticated: authToken.valid(),
        };
    }

    onLogin = () => {
        this.setState({
            user: credentials.get(),
            isAuthenticated: authToken.valid(),
        });
    };

    onLogout = () => {
        this.setState({
            user: null,
            isAuthenticated: false,
        });
    };

    render() {
        const { isAuthenticated } = this.state;

        return (
            <Layout onLogout={this.onLogout}>
                {isAuthenticated ? (
                    <Switch>
                        <Route path="/chats" exact>
                            <GroupList />
                        </Route>
                        <Redirect to="/chats" />
                    </Switch>
                ) : (
                    <Switch>
                        <Route path="/login">
                            <Login onLogin={this.onLogin} />
                        </Route>
                        <Route path="/register">
                            <Register onLogin={this.onLogin} />
                        </Route>
                        <Redirect to="/login" />
                    </Switch>
                )}
            </Layout>
        );
    }
}
