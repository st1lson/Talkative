import React, { useState, useRef } from 'react';
import axiosRESTInstance from '../../global/js/axiosRESTInstance';
import Input from '../../components/Input/Input';
import classes from './Profile.module.scss';

const saveImage = image => {
    if (!image) {
        return;
    }

    const data = new FormData();
    data.append('image', image);

    axiosRESTInstance
        .post('profiles/upload', data)
        .then(res => {
            console.log(res);
        })
        .catch(err => {
            console.log(err);
        });
};

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

    //image
    const [image, setImage] = useState(null);
    const [isImageUpdated, setIsImageUpdated] = useState(false);
    const imageRef = useRef();

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
                            className={classes.button1}
                            onClick={() => {
                                setUserNameDisabledValue(true);
                                setUserNameInChange(false);
                            }}>
                            Back
                        </button>
                        <button
                            className={classes.button2}
                            onClick={() => console.log('change email')}>
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
                            className={classes.button1}
                            onClick={() => {
                                setEmailDisabledValue(true);
                                setEmailInChange(false);
                            }}>
                            Back
                        </button>
                        <button
                            className={classes.button2}
                            onClick={() => console.log('change email')}>
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
                            <button
                                className={classes.button1}
                                onClick={() => setPasswordInChange(false)}>
                                Back
                            </button>
                            <button
                                className={classes.button2}
                                onClick={() => console.log('change password')}>
                                Submit
                            </button>
                        </div>
                    </div>
                ) : (
                    <button onClick={() => setPasswordInChange(true)}>
                        Change your password
                    </button>
                )}
            </div>
            <div className={classes.imageWrapper}>
                <div className={classes.imageContainer}>
                    <label htmlFor="file-input">
                        <img
                            src={imageUrl}
                            ref={imageRef}
                            width="600"
                            height="600"
                        />
                    </label>
                    <input
                        id="file-input"
                        type="file"
                        onChange={e => {
                            const image = e.target?.files[0];
                            setImage(image);
                            const reader = new FileReader();
                            reader.addEventListener('load', () => {
                                imageRef.current.src = reader.result;
                            });
                            reader.readAsDataURL(image);
                            setIsImageUpdated(true);
                        }}
                    />
                </div>
                <button
                    disabled={!isImageUpdated}
                    onClick={() => saveImage(image)}>
                    Save image
                </button>
            </div>
        </div>
    );
};

export default Profile;
