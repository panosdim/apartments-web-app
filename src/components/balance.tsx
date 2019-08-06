import React, { useState, useEffect } from 'react';
import { Card, H3, Elevation, HTMLTable, Intent, Button, Classes } from '@blueprintjs/core';
import { useGlobal } from 'reactn';
import axios from 'axios';
import { BalanceType } from '../model';
import { AppToaster, formatMySQLDateString, formatEuro } from '.';
import { Colors } from '@blueprintjs/core';
import useModal from './useModal';
import { BalanceForm } from './balanceForm';

export const Balance: React.FC = () => {
    const [selectedFlat] = useGlobal('selectedFlat');
    const [allBalance, setAllBalance] = useGlobal('allBalance');
    const [selectedBalance, setSelectedBalance] = useGlobal('selectedBalance');

    const [isNew, setNew] = useState(false);
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
        balance.sort((a, b) => b.date.localeCompare(a.date));
        setSelectedBalance(balance[0]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [balance]);

    const handleSelection = (balance: BalanceType) => {
        setSelectedBalance(balance);
        setNew(false);
        toggle();
    };

    const addBalance = () => {
        setNew(true);
        toggle();
    };

    const handleFinish = (balanceData: BalanceType) => {
        isNew
            ? setBalance([...balance, balanceData])
            : setBalance(balance.map(bal => (bal.id === selectedBalance.id ? balanceData : bal)));

        isNew
            ? setAllBalance([...allBalance, balanceData])
            : setAllBalance(allBalance.map(bal => (bal.id === selectedBalance.id ? balanceData : bal)));
    };

    return (
        <>
            <Card interactive={true} elevation={Elevation.TWO} style={{ width: 'max-content', height: 'max-content' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                    <H3>Balance Management</H3>
                    <Button icon='plus' intent={Intent.SUCCESS} text='Add' onClick={addBalance} />
                </div>

                <HTMLTable
                    className={balance ? 'scroll' : Classes.SKELETON}
                    interactive={true}
                    condensed={true}
                    style={{ minWidth: '450px' }}
                >
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
                                    style={bal.amount > 0 ? { background: Colors.GREEN3 } : { background: Colors.RED3 }}
                                >
                                    <td>{formatMySQLDateString(bal.date)}</td>
                                    <td>{formatEuro(bal.amount)}</td>
                                    <td>{bal.comment}</td>
                                </tr>
                            ))}
                    </tbody>
                </HTMLTable>
            </Card>
            <BalanceForm isShowing={isShowing} isNew={isNew} hide={toggle} onFinish={handleFinish} />
        </>
    );
};
