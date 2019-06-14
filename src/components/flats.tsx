import React from 'react';
import { Card, H3, Elevation, HTMLTable } from '@blueprintjs/core';
import { useGlobal } from 'reactn';
import axios from 'axios';
import { FlatType } from '../model';

export const Flats: React.FC = () => {
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

    const handleSelection = (flat: FlatType) => {
        console.log(flat);
    };

    return (
        <Card interactive={true} elevation={Elevation.TWO} style={{ width: 'max-content', height: 'max-content' }}>
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
    );
};
