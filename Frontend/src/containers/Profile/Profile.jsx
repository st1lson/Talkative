import React, { useState } from 'react';
import Input from '../../components/Input/Input';
import classes from './Profile.module.scss';

const Profile = props => {
    const { userName, email, imageUrl } = props;

    // values
    const [newUserName, setNewUserName] = useState(userName);
    const [newEmail, setNewEmail] = useState(email);
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    //inputs
    const [userNameDisabledValue, setUserNameDisabledValue] = useState(true);
    const [emailDisabledValue, setEmailDisabledValue] = useState(true);
    const [passwordInChange, setPasswordInChange] = useState(false);

    return (
        <div className={classes.profileContrainer}>
            <div className={classes.userDataContainer}>
                <Input
                    value={newUserName}
                    type="text"
                    name="newUserName"
                    disabled={userNameDisabledValue}
                    onChange={e => setNewUserName(e.target.value)}
                />
                <button onClick={() => setUserNameDisabledValue(false)}>
                    Change your user name
                </button>
                <Input
                    value={newEmail}
                    type="email"
                    name="newEmail"
                    disabled={emailDisabledValue}
                    onChange={e => setNewEmail(e.target.value)}
                />
                <button onClick={() => setEmailDisabledValue(false)}>
                    Change your email
                </button>
                {passwordInChange ? (
                    <div className={classes.passwordWrapper}>
                        <Input
                            value={password}
                            type="password"
                            name="password"
                            disabled={true}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Input
                            value={newPassword}
                            type="password"
                            name="newPassword"
                            disabled={true}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                        <Input
                            value={confirmedPassword}
                            type="password"
                            name="confirmedPassword"
                            disabled={true}
                            onChange={e => setConfirmedPassword(e.target.value)}
                        />
                        <button onClick={() => setPasswordInChange(false)}>
                            Back
                        </button>
                        <button onClick={() => console.log('change password')}>
                            Continue
                        </button>
                    </div>
                ) : (
                    <button onClick={() => setPasswordInChange(true)}>
                        Change your password
                    </button>
                )}
            </div>
            <img src={imageUrl} width="400" height="400" />
        </div>
    );
};

export default Profile;
