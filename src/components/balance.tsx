import React, { useState, useEffect } from 'react';
import { Card, H3, Elevation, HTMLTable, Intent, Button, Classes, H5, Popover, Position } from '@blueprintjs/core';
import { useGlobal, setGlobal } from 'reactn';
import axios from 'axios';
import { BalanceType } from '../model';
import { AppToaster, formatMySQLDateString, formatEuro } from '.';
import { Colors } from '@blueprintjs/core';
import useModal from './useModal';

export const Balance: React.FC = () => {
    const [selectedFlat] = useGlobal('selectedFlat');
    const [allBalance, setAllBalance] = useGlobal('allBalance');
    const [selectedBalance, setSelectedBalance] = useGlobal('selectedBalance');

    const [isNew, setNew] = useState(false);
    const [isLoading, setLoading] = useState(false);
    const [balance, setBalance] = useState<BalanceType[]>([]);
    const { isShowing, toggle } = useModal();

    useEffect(() => {
        axios
            .get('balance')
            .then(response => {
                setAllBalance(response.data);
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
            setBalance(
                allBalance.filter(bal => bal.flat_id === selectedFlat.id).sort((a, b) => b.date.localeCompare(a.date)),
            );
        }
    }, [selectedFlat, allBalance]);

    useEffect(() => {
        setSelectedBalance(balance[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [balance]);

    const handleSelection = (balance: BalanceType) => {
        setSelectedBalance(balance);
    };

    const addBalance = () => {
        setNew(true);
        toggle();
    };

    const editBalance = () => {
        setNew(false);
        toggle();
    };

    const handleFinish = (balanceData: BalanceType) => {
        isNew
            ? setBalance([...balance, balanceData])
            : setBalance(balance.map(bal => (bal.id === selectedBalance.id ? balanceData : bal)));
    };

    const deleteBalance = () => {
        setLoading(true);
        axios
            .delete(`balance/${selectedBalance.id}`)
            .then(() => {
                setBalance(balance.filter(bal => bal.id !== selectedBalance.id));
                setLoading(false);
                setSelectedBalance(balance[0]);

                AppToaster.show({
                    intent: Intent.SUCCESS,
                    message: 'Balance deleted successfully.',
                });
            })
            .catch(error => {
                if (error.response && error.response.status === 400) {
                    // JWT Token expired
                    setLoading(false);
                    setGlobal({ isLoggedIn: false });
                    AppToaster.show({
                        intent: Intent.DANGER,
                        message: error.response.data.error,
                    });
                } else {
                    AppToaster.show({
                        intent: Intent.DANGER,
                        message: 'Fail to delete Balance',
                    });
                    setLoading(false);
                }
            });
    };

    const popoverContent = (
        <div key='text'>
            <H5>Confirm deletion</H5>
            <p>Are you sure you want to delete selected balance? You won't be able to recover it.</p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 15 }}>
                <Button className={Classes.POPOVER_DISMISS} style={{ marginRight: 10 }}>
                    Cancel
                </Button>
                <Button intent={Intent.DANGER} className={Classes.POPOVER_DISMISS} onClick={deleteBalance}>
                    Delete
                </Button>
            </div>
        </div>
    );

    return (
        <>
            <Card interactive={true} elevation={Elevation.TWO} style={{ width: 'max-content', height: 'max-content' }}>
                <H3>Balance Management</H3>
                <HTMLTable className={balance ? '' : Classes.SKELETON} interactive={true} condensed={true}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Amount</th>
                            <th>Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {balance &&
                            balance.map(bal => (
                                <tr
                                    key={bal.id}
                                    onClick={() => handleSelection(bal)}
                                    style={
                                        selectedBalance && bal.id === selectedBalance.id
                                            ? { background: Colors.BLUE3 }
                                            : bal.amount > 0
                                            ? { background: Colors.GREEN3 }
                                            : { background: Colors.RED3 }
                                    }
                                >
                                    <td>{formatMySQLDateString(bal.date)}</td>
                                    <td>{formatEuro(bal.amount)}</td>
                                    <td>{bal.comment}</td>
                                </tr>
                            ))}
                    </tbody>
                </HTMLTable>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    <Button icon='plus' intent={Intent.SUCCESS} text='Add' onClick={addBalance} />
                    <Button icon='edit' intent={Intent.WARNING} text='Edit' onClick={editBalance} />
                    <Popover
                        content={popoverContent}
                        popoverClassName={Classes.POPOVER_CONTENT_SIZING}
                        position={Position.BOTTOM}
                    >
                        <Button icon='trash' loading={isLoading} intent={Intent.DANGER} text='Delete' />
                    </Popover>
                </div>
            </Card>
        </>
    );
};
