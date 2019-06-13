import React from 'react';
import { Card, H3, Elevation, Button, Intent, Navbar, Alignment, HTMLTable } from '@blueprintjs/core';
import { useGlobal, setGlobal } from 'reactn';
import axios from 'axios';
import { FlatType } from '../model';

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

    const handleSelection = (flat: FlatType) => {
        console.log(flat);
    };

    return (
        <>
            <Navbar style={{ marginBottom: '16px' }}>
                <Navbar.Group align={Alignment.LEFT}>
                    <Navbar.Heading>Apartments Management</Navbar.Heading>
                </Navbar.Group>
                <Navbar.Group align={Alignment.RIGHT}>
                    <Navbar.Heading>{user.first_name + ' ' + user.last_name}</Navbar.Heading>
                    <Navbar.Divider />
                    <Button icon='log-out' intent={Intent.DANGER} text='Logout' onClick={logout} />
                </Navbar.Group>
            </Navbar>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Card
                    interactive={true}
                    elevation={Elevation.TWO}
                    style={{ width: 'max-content', height: 'max-content' }}
                >
                    <H3>Flats Management</H3>
                    <HTMLTable interactive={true} condensed={true}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Floor</th>
                            </tr>
                        </thead>
                        <tbody>
                            {flats &&
                                flats.map(flat => (
                                    <tr key={flat.id} onClick={() => handleSelection(flat)}>
                                        <td>{flat.name}</td>
                                        <td>{flat.address}</td>
                                        <td>{flat.floor}</td>
                                    </tr>
                                ))}
                        </tbody>
                    </HTMLTable>
                </Card>
            </div>
        </>
    );
};
