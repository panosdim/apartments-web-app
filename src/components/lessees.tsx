import React, { useState, useEffect } from 'react';
import { Card, H3, Elevation, HTMLTable, Intent, Button, Classes } from '@blueprintjs/core';
import { useGlobal } from 'reactn';
import axios from 'axios';
import { LesseeType } from '../model';
import { AppToaster, formatMySQLDateString, toMySQLDateString, chartMoneyFmt } from '.';
import { Colors } from '@blueprintjs/core';
import { LesseesForm } from './lesseesForm';
import useModal from './useModal';

export const Lessees: React.FC = () => {
    const [selectedFlat] = useGlobal('selectedFlat');
    const [allLessees, setAllLessees] = useGlobal('allLessees');
    const [selectedLessee, setSelectedLessee] = useGlobal('selectedLessee');

    const [isNew, setNew] = useState(false);
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
        setNew(false);
        toggle();
    };

    const addLessee = () => {
        setNew(true);
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

    return (
        <>
            <Card interactive={true} elevation={Elevation.TWO} style={{ width: 'max-content', height: 'max-content' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    <H3>Lessees Management</H3>
                    <Button icon='plus' intent={Intent.SUCCESS} text='Add' onClick={addLessee} />
                </div>
                <HTMLTable className={lessees ? '' : Classes.SKELETON} interactive={true} condensed={true}>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Postal Code</th>
                            <th>TIN</th>
                            <th>Rent</th>
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
                                        lessee.until > toMySQLDateString(new Date())
                                            ? { background: Colors.GREEN3 }
                                            : { background: Colors.RED3 }
                                    }
                                >
                                    <td>{lessee.name}</td>
                                    <td>{lessee.address}</td>
                                    <td>{lessee.postal_code}</td>
                                    <td>{lessee.tin}</td>
                                    <td>{chartMoneyFmt.format(lessee.rent)}</td>
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
