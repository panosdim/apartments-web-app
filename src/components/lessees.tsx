import React, { useState, useEffect } from 'react';
import { Card, H3, Elevation, HTMLTable, Intent, Button, Classes, H5, Popover, Position } from '@blueprintjs/core';
import { useGlobal, setGlobal } from 'reactn';
import axios from 'axios';
import { LesseeType } from '../model';
import { AppToaster, formatMySQLDateString, toMySQLDateString } from '.';
import { Colors } from '@blueprintjs/core';
import { LesseesForm } from './lesseesForm';
import useModal from './useModal';

export const Lessees: React.FC = () => {
    const [selectedFlat] = useGlobal('selectedFlat');
    const [allLessees, setAllLessees] = useGlobal('allLessees');
    const [selectedLessee, setSelectedLessee] = useGlobal('selectedLessee');

    const [isNew, setNew] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [lessees, setLessees] = useState<LesseeType[]>([]);
    const { isShowing, toggle } = useModal();

    useEffect(() => {
        axios
            .get('lessee')
            .then(response => {
                setAllLessees(response.data);
            })
            .catch(error => {
                AppToaster.show({
                    intent: Intent.DANGER,
                    message: 'Could not fetch lessees data from server.',
                });
                console.log(error);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedFlat.id) {
            setLessees(allLessees.filter(lessee => lessee.flat_id === selectedFlat.id));
        }
    }, [selectedFlat, allLessees]);

    useEffect(() => {
        setSelectedLessee(lessees[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lessees]);

    const handleSelection = (lessee: LesseeType) => {
        setSelectedLessee(lessee);
    };

    const addLessee = () => {
        setNew(true);
        toggle();
    };

    const editLessee = () => {
        setNew(false);
        toggle();
    };

    const handleFinish = (lesseeData: LesseeType) => {
        isNew
            ? setLessees([...lessees, lesseeData])
            : setLessees(lessees.map(lessee => (lessee.id === selectedLessee.id ? lesseeData : lessee)));
        isNew
            ? setAllLessees([...allLessees, lesseeData])
            : setAllLessees(allLessees.map(lessee => (lessee.id === selectedLessee.id ? lesseeData : lessee)));
    };

    const deleteLessee = () => {
        setLoading(true);
        axios
            .delete(`lessee/${selectedLessee.id}`)
            .then(() => {
                setLessees(lessees.filter(lessee => lessee.id !== selectedLessee.id));
                setAllLessees(allLessees.filter(lessee => lessee.id !== selectedLessee.id));
                setLoading(false);
                setSelectedLessee(lessees[0]);

                AppToaster.show({
                    intent: Intent.SUCCESS,
                    message: 'Lessee deleted successfully.',
                });
            })
            .catch(error => {
                setLoading(false);
                if (error.response && error.response.status === 400) {
                    // JWT Token expired
                    setGlobal({ isLoggedIn: false });
                    AppToaster.show({
                        intent: Intent.DANGER,
                        message: error.response.data.error,
                    });
                } else {
                    AppToaster.show({
                        intent: Intent.DANGER,
                        message: 'Fail to delete Lessee',
                    });
                }
            });
    };

    const popoverContent = (
        <div key='text'>
            <H5>Confirm deletion</H5>
            <p>Are you sure you want to delete selected lessee? You won't be able to recover it.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
                <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                    Cancel
                </Button>
                <Button intent={Intent.DANGER} className={Classes.POPOVER_DISMISS} onClick={deleteLessee}>
                    Delete
                </Button>
            </div>
        </div>
    );

    return (
        <>
            <Card interactive={true} elevation={Elevation.TWO} style={{ width: 'max-content', height: 'max-content' }}>
                <H3>Lessees Management</H3>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    <Button icon='plus' intent={Intent.SUCCESS} text='Add' onClick={addLessee} />
                    <Button icon='edit' intent={Intent.WARNING} text='Edit' onClick={editLessee} />
                    <Popover
                        content={popoverContent}
                        popoverClassName={Classes.POPOVER_CONTENT_SIZING}
                        position={Position.BOTTOM}
                    >
                        <Button icon='trash' loading={isLoading} intent={Intent.DANGER} text='Delete' />
                    </Popover>
                </div>
                <HTMLTable className={lessees ? '' : Classes.SKELETON} interactive={true} condensed={true}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Postal Code</th>
                            <th>Rented From</th>
                            <th>Rented Until</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lessees &&
                            lessees.map(lessee => (
                                <tr
                                    key={lessee.id}
                                    onClick={() => handleSelection(lessee)}
                                    style={
                                        selectedLessee && lessee.id === selectedLessee.id
                                            ? { background: Colors.BLUE3 }
                                            : lessee.until > toMySQLDateString(new Date())
                                            ? { background: Colors.GREEN3 }
                                            : { background: Colors.RED3 }
                                    }
                                >
                                    <td>{lessee.name}</td>
                                    <td>{lessee.address}</td>
                                    <td>{lessee.postal_code}</td>
                                    <td>{lessee.from && formatMySQLDateString(lessee.from)}</td>
                                    <td>{lessee.until && formatMySQLDateString(lessee.until)}</td>
                                </tr>
                            ))}
                    </tbody>
                </HTMLTable>
            </Card>
            <LesseesForm isShowing={isShowing} isNew={isNew} hide={toggle} onFinish={handleFinish} />
        </>
    );
};
