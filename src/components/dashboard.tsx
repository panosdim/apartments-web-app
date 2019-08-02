import React, { useEffect, useState } from 'react';
import { Callout, Tag, Intent } from '@blueprintjs/core';
import { useGlobal } from 'reactn';
import { moneyFmt } from '.';

export const Dashboard: React.FC = () => {
    const [selectedFlat] = useGlobal('selectedFlat');
    const [allBalance] = useGlobal('allBalance');
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [totalExpenses, setTotalExpenses] = useState<number>(0);
    const [totalSavings, setTotalSavings] = useState<number>(0);
    const [income, setIncome] = useState<number>(0);
    const [expenses, setExpenses] = useState<number>(0);
    const [savings, setSavings] = useState<number>(0);

    useEffect(() => {
        setTotalIncome(allBalance.reduce((totInc, bal) => (totInc += bal.amount > 0 ? bal.amount : 0), 0));
        setTotalExpenses(allBalance.reduce((totExp, bal) => (totExp += bal.amount < 0 ? bal.amount : 0), 0));
    }, [allBalance]);

    useEffect(() => {
        if (selectedFlat.id) {
            setIncome(
                allBalance
                    .filter(bal => bal.flat_id === selectedFlat.id)
                    .reduce((totInc, bal) => (totInc += bal.amount > 0 ? bal.amount : 0), 0),
            );

            setExpenses(
                allBalance
                    .filter(bal => bal.flat_id === selectedFlat.id)
                    .reduce((totExp, bal) => (totExp += bal.amount < 0 ? bal.amount : 0), 0),
            );
        }
    }, [selectedFlat, allBalance]);

    useEffect(() => {
        setTotalSavings(totalIncome - Math.abs(totalExpenses));
    }, [totalIncome, totalExpenses]);

    useEffect(() => {
        setSavings(income - Math.abs(expenses));
    }, [income, expenses]);

    return (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Callout title='Total Statistics'>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h3>Income</h3>
                        <Tag large={true} rightIcon='euro' intent={Intent.SUCCESS}>
                            {moneyFmt(totalIncome)}
                        </Tag>
                    </div>
                    <div>
                        <h3>Expenses</h3>
                        <Tag large={true} rightIcon='euro' intent={Intent.DANGER}>
                            {moneyFmt(Math.abs(totalExpenses))}
                        </Tag>
                    </div>
                    <div>
                        <h3>Savings</h3>
                        <Tag large={true} rightIcon='euro' intent={Intent.PRIMARY}>
                            {moneyFmt(totalSavings)}
                        </Tag>
                    </div>
                </div>
            </Callout>
            <Callout title='Apartment Statistics' style={{ marginLeft: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                        <h3>Income</h3>
                        <Tag large={true} rightIcon='euro' intent={Intent.SUCCESS}>
                            {moneyFmt(income)}
                        </Tag>
                    </div>
                    <div>
                        <h3>Expenses</h3>
                        <Tag large={true} rightIcon='euro' intent={Intent.DANGER}>
                            {moneyFmt(Math.abs(expenses))}
                        </Tag>
                    </div>
                    <div>
                        <h3>Savings</h3>
                        <Tag large={true} rightIcon='euro' intent={Intent.PRIMARY}>
                            {moneyFmt(savings)}
                        </Tag>
                    </div>
                </div>
            </Callout>
        </div>
    );
};
