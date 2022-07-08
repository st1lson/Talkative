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

    //change in progress
    const [userNameInChange, setUserNameInChange] = useState(false);
    const [emailInChange, setEmailInChange] = useState(false);
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
                {userNameInChange ? (
                    <div className={classes.buttonsWrapper}>
                        <button
                            onClick={() => {
                                setUserNameDisabledValue(true);
                                setUserNameInChange(false);
                            }}>
                            Back
                        </button>
                        <button onClick={() => console.log('change email')}>
                            Submit
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            setUserNameDisabledValue(false);
                            setUserNameInChange(true);
                        }}>
                        Change your user name
                    </button>
                )}
                <Input
                    value={newEmail}
                    type="text"
                    name="newEmail"
                    disabled={emailDisabledValue}
                    onChange={e => setNewEmail(e.target.value)}
                />
                {emailInChange ? (
                    <div className={classes.buttonsWrapper}>
                        <button
                            onClick={() => {
                                setEmailDisabledValue(true);
                                setEmailInChange(false);
                            }}>
                            Back
                        </button>
                        <button onClick={() => console.log('change email')}>
                            Submit
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={() => {
                            setEmailDisabledValue(false);
                            setEmailInChange(true);
                        }}>
                        Change your email
                    </button>
                )}
                {passwordInChange ? (
                    <div className={classes.passwordWrapper}>
                        <Input
                            label="Enter your current password"
                            labelColor="white"
                            value={password}
                            type="password"
                            name="password"
                            disabled={false}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <Input
                            label="Enter your new password"
                            labelColor="white"
                            value={newPassword}
                            type="password"
                            name="newPassword"
                            disabled={false}
                            onChange={e => setNewPassword(e.target.value)}
                        />
                        <Input
                            label="Confirm your new password"
                            labelColor="white"
                            value={confirmedPassword}
                            type="password"
                            name="confirmedPassword"
                            disabled={false}
                            onChange={e => setConfirmedPassword(e.target.value)}
                        />
                        <div className={classes.buttonsWrapper}>
                            <button onClick={() => setPasswordInChange(false)}>
                                Back
                            </button>
                            <button
                                onClick={() => console.log('change password')}>
                                Continue
                            </button>
                        </div>
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
