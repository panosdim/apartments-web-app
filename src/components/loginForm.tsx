import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGlobal } from 'reactn';
import { FormGroup, InputGroup, Button, Tooltip, Intent } from '@blueprintjs/core';
import { AppToaster, useForm } from '.';

export const LoginForm = () => {
    const [, setLoggedIn] = useGlobal('isLoggedIn');
    const [, setUser] = useGlobal('user');
    const [isLoading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isAuthenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            setLoggedIn(true);
        }

        return () => setAuthenticated(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    const login = () => {
        setLoading(true);

        axios
            .post('login', values)
            .then(response => {
                localStorage.setItem('token', response.data.token);
                axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
                setLoading(false);
                setUser(response.data.user);
                setAuthenticated(true);
            })
            .catch(() => {
                AppToaster.show({
                    intent: Intent.DANGER,
                    message: 'Login error. Please check your email or password.',
                });
                setLoading(false);
            });
    };

    const { values, errors, handleChange, handleSubmit, setRef } = useForm(login);
    const loginFormRef = setRef as React.Ref<HTMLFormElement>;

    const handleLockClick = () => setShowPassword(!showPassword);

    const lockButton = (
        <Tooltip content={`${showPassword ? 'Hide' : 'Show'} Password`}>
            <Button
                icon={showPassword ? 'unlock' : 'lock'}
                intent={Intent.WARNING}
                minimal={true}
                onClick={handleLockClick}
            />
        </Tooltip>
    );

    return (
        <form onSubmit={handleSubmit} noValidate ref={loginFormRef}>
            <FormGroup
                label='Email'
                labelFor='email-input'
                labelInfo='(required)'
                helperText={errors.email}
                intent={errors.email ? Intent.DANGER : Intent.SUCCESS}
            >
                <InputGroup
                    id='email-input'
                    name='email'
                    leftIcon='user'
                    placeholder='Email'
                    type='email'
                    onChange={handleChange}
                    value={values.email || ''}
                    intent={errors.email ? Intent.DANGER : Intent.SUCCESS}
                    required
                />
            </FormGroup>

            <FormGroup
                label='Password'
                labelFor='password-input'
                labelInfo='(required)'
                helperText={errors.password}
                intent={errors.password ? Intent.DANGER : Intent.SUCCESS}
            >
                <InputGroup
                    id='password-input'
                    name='password'
                    leftIcon='key'
                    rightElement={lockButton}
                    placeholder='Password'
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleChange}
                    value={values.password || ''}
                    intent={errors.password ? Intent.DANGER : Intent.SUCCESS}
                    required
                />
            </FormGroup>
            <Button icon='log-in' intent={Intent.PRIMARY} loading={isLoading} text='Login' type='submit' />
        </form>
    );
};
