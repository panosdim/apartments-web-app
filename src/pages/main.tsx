import React from 'react';
import { H1, Card, H3, Elevation, Button, Intent, H4, H5 } from '@blueprintjs/core';
import { useGlobal, setGlobal } from 'reactn';
import axios from 'axios';

export const Main: React.FC = () => {
    const [user] = useGlobal('user');
    const [flats, setFlats] = useGlobal('flats');

    React.useEffect(() => {
        axios
            .get('flat')
            .then(response => {
                setFlats(response.data);
            })
            .catch(error => {
                console.log(error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        setGlobal({ isLoggedIn: false });
    };

    return (
        <>
            <H1 style={{ textAlign: 'center' }}>Apartments Management App</H1>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card interactive={true} elevation={Elevation.TWO} style={{ width: 'max-content' }}>
                    <H3>User Info</H3>
                    <H4>{user.first_name + ' ' + user.last_name}</H4>
                    <H5>{user.email}</H5>
                    <Button icon='log-out' intent={Intent.DANGER} text='Logout' onClick={logout} />
                </Card>
                <Card interactive={true} elevation={Elevation.TWO} style={{ width: 'max-content' }}>
                    <H3>Flats Management</H3>
                    {flats && flats.map(flat => <H4>{flat.name + ' ' + flat.address + ' ' + flat.floor}</H4>)}
                </Card>
            </div>
        </>
    );
};
