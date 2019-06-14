import React from 'react';
import { Card, H3, Elevation, HTMLTable, Intent, Button } from '@blueprintjs/core';
import { useGlobal } from 'reactn';
import axios from 'axios';
import { FlatType } from '../model';
import { AppToaster } from '.';
import { Colors } from '@blueprintjs/core';

export const Flats: React.FC = () => {
    const [flats, setFlats] = useGlobal('flats');
    const [selectedFlat, setSelectedFlat] = useGlobal('selectedFlat');

    React.useEffect(() => {
        axios
            .get('flat')
            .then(response => {
                setFlats(response.data);
                setSelectedFlat(response.data[0]);
            })
            .catch(error => {
                AppToaster.show({
                    intent: Intent.DANGER,
                    message: 'Could not fetch flat data from server.',
                });
                console.log(error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSelection = (flat: FlatType) => {
        setSelectedFlat(flat);
        console.log(flat);
    };

    const addFlat = () => {};

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
                            <tr
                                key={flat.id}
                                onClick={() => handleSelection(flat)}
                                style={selectedFlat && flat.id === selectedFlat.id ? { background: Colors.BLUE3 } : {}}
                            >
                                <td>{flat.name}</td>
                                <td>{flat.address}</td>
                                <td>{flat.floor}</td>
                            </tr>
                        ))}
                </tbody>
            </HTMLTable>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                <Button icon='plus' intent={Intent.SUCCESS} text='Add' onClick={addFlat} />
                <Button icon='edit' intent={Intent.WARNING} text='Edit' onClick={addFlat} />
                <Button icon='trash' intent={Intent.DANGER} text='Delete' onClick={addFlat} />
            </div>
        </Card>
    );
};
