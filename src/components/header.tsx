import React from 'react';
import { Button, Intent, Navbar, Alignment } from '@blueprintjs/core';
import { useGlobal, setGlobal } from 'reactn';
import logo from '../images/header-logo.png';

export const Header: React.FC = () => {
    const [user] = useGlobal('user');

    const logout = () => {
        localStorage.removeItem('token');
        setGlobal({ isLoggedIn: false });
    };

    return (
        <Navbar style={{ marginBottom: '16px' }}>
            <Navbar.Group align={Alignment.LEFT}>
                <img width='32' alt='Apartments Management Logo' src={logo} />
                <Navbar.Divider />
                <Navbar.Heading>Apartments Management</Navbar.Heading>
            </Navbar.Group>
            <Navbar.Group align={Alignment.RIGHT}>
                <Navbar.Heading>{user.firstName + ' ' + user.lastName}</Navbar.Heading>
                <Navbar.Divider />
                <Button icon='log-out' intent={Intent.DANGER} text='Logout' onClick={logout} />
            </Navbar.Group>
        </Navbar>
    );
};
