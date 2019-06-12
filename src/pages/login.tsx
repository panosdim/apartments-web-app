import React from 'react';
import { Card, Elevation, H3 } from '@blueprintjs/core';
import logo from '../images/logo.png';
import { LoginForm } from '../components';

export const Login: React.FC = () => {
    return (
        <div className='center'>
            <Card interactive={true} elevation={Elevation.TWO}>
                <H3>Apartments Management</H3>
                <img width='300' alt='Apartments Management Logo' src={logo} />
                <LoginForm />
            </Card>
        </div>
    );
};
