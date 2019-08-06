import React, { useEffect, useState } from 'react';
import { Callout, Tag, Intent } from '@blueprintjs/core';
import { useGlobal } from 'reactn';
import { moneyFmt, getYear, chartMoneyFmt } from '.';
import { LineChart, XAxis, Tooltip, ResponsiveContainer, Line } from 'recharts';

export const Dashboard: React.FC = () => {
    const [selectedFlat] = useGlobal('selectedFlat');
    const [allBalance] = useGlobal('allBalance');
    const [totalIncome, setTotalIncome] = useState<number>(0);
    const [totalExpenses, setTotalExpenses] = useState<number>(0);
    const [totalSavings, setTotalSavings] = useState<number>(0);
    const [income, setIncome] = useState<number>(0);
    const [expenses, setExpenses] = useState<number>(0);
    const [savings, setSavings] = useState<number>(0);
    const [totalChartData, setTotalChartData] = useState<overviewChartType[]>();
    const [chartData, setChartData] = useState<overviewChartType[]>();

    type overviewChartType = {
        name: string;
        savings: number;
    };

    useEffect(() => {
        setTotalIncome(allBalance.reduce((totInc, bal) => (totInc += bal.amount > 0 ? bal.amount : 0), 0));
        setTotalExpenses(allBalance.reduce((totExp, bal) => (totExp += bal.amount < 0 ? bal.amount : 0), 0));

        const incomePerYear = allBalance.reduce((years, inc) => {
            const year = getYear(inc.date);
            if (inc.amount > 0) {
                years[year] = (years[year] || 0) + inc.amount;
            }
            return years;
        }, {});

        const expensesPerYear = allBalance.reduce((years, exp) => {
            const year = getYear(exp.date);
            if (exp.amount < 0) {
                years[year] = (years[year] || 0) + exp.amount;
            }
            return years;
        }, {});

        const overviewData: overviewChartType[] = [];
        for (const key in incomePerYear) {
            const inc = incomePerYear[key] || 0;
            const exp = expensesPerYear[key] || 0;
            const savings = inc - Math.abs(exp);
            overviewData.push({
                name: key,
                savings: savings ? savings : 0,
            });
        }

        setTotalChartData(overviewData);
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

            const incomePerYear = allBalance
                .filter(bal => bal.flat_id === selectedFlat.id)
                .reduce((years, inc) => {
                    const year = getYear(inc.date);
                    if (inc.amount > 0) {
                        years[year] = (years[year] || 0) + inc.amount;
                    }
                    return years;
                }, {});

            const expensesPerYear = allBalance
                .filter(bal => bal.flat_id === selectedFlat.id)
                .reduce((years, exp) => {
                    const year = getYear(exp.date);
                    if (exp.amount < 0) {
                        years[year] = (years[year] || 0) + exp.amount;
                    }
                    return years;
                }, {});

            const overviewData: overviewChartType[] = [];
            for (const key in incomePerYear) {
                const inc = incomePerYear[key] || 0;
                const exp = expensesPerYear[key] || 0;
                const savings = inc - Math.abs(exp);
                overviewData.push({
                    name: key,
                    savings: savings ? savings : 0,
                });
            }

            setChartData(overviewData);
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
                <div>
                    <ResponsiveContainer width='100%' aspect={2 / 1}>
                        <LineChart
                            height={200}
                            data={totalChartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey='name' />
                            <Tooltip formatter={value => chartMoneyFmt.format(Number(value))} />
                            <Line type='monotone' dataKey='savings' stroke='#8884d8' strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
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
                <div>
                    <ResponsiveContainer width='100%' aspect={2 / 1}>
                        <LineChart
                            width={300}
                            height={200}
                            data={chartData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                            <XAxis dataKey='name' />
                            <Tooltip formatter={value => chartMoneyFmt.format(Number(value))} />
                            <Line type='monotone' dataKey='savings' stroke='#428bca' strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
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
