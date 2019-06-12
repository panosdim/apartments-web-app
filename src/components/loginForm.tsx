import React, { useState } from 'react';

import axios from 'axios';
import { setGlobal } from 'reactn';
import { FormGroup, InputGroup, Button, Tooltip, Intent } from '@blueprintjs/core';
import { AppToaster } from '.';

export const LoginForm = () => {
    const [isLoading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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

    const formToJSON = (elements: HTMLFormControlsCollection) =>
        [].reduce.call(
            elements,
            (data: any, element: HTMLFormElement) => {
                if (element.name) {
                    data[element.name] = element.value;
                }

                return data;
            },
            {},
        );

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;
        const inputs = form.elements;
        const email = inputs['email' as any] as HTMLInputElement;
        const password = inputs['password' as any] as HTMLInputElement;

        if (form.checkValidity()) {
            email.classList.remove('bp3-intent-danger');
            password.classList.remove('bp3-intent-danger');
            const data = formToJSON(form.elements);
            setLoading(true);

            axios
                .post('login', data)
                .then(response => {
                    localStorage.setItem('token', response.data.token);
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
                    setLoading(false);
                    setGlobal({ isLoggedIn: true });
                })
                .catch(() => {
                    AppToaster.show({
                        intent: Intent.DANGER,
                        message: 'Login error. Please check your email or password.',
                    });
                    setLoading(false);
                });
        } else {
            email.validity.valid
                ? email.classList.remove('bp3-intent-danger')
                : email.classList.add('bp3-intent-danger');

            password.validity.valid
                ? password.classList.remove('bp3-intent-danger')
                : password.classList.add('bp3-intent-danger');
        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate>
            <FormGroup label='Email' labelFor='email-input' labelInfo='(required)'>
                <InputGroup id='email-input' name='email' leftIcon='user' placeholder='Email' type='email' required />
            </FormGroup>

            <FormGroup label='Password' labelFor='password-input' labelInfo='(required)'>
                <InputGroup
                    id='password-input'
                    name='password'
                    leftIcon='key'
                    rightElement={lockButton}
                    placeholder='Password'
                    type={showPassword ? 'text' : 'password'}
                    required
                />
            </FormGroup>
            <Button icon='log-in' intent={Intent.PRIMARY} loading={isLoading} text='Log in' type='submit' />
        </form>
    );
};
