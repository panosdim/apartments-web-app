import React from 'react';
import { Flats, Lessees, Balance, Dashboard } from '../components';
import { Header } from '../components/header';

export const Main: React.FC = () => {
    return (
        <>
            <div style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
                <Header />
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px' }}>
                    <div
                        style={{
                            display: 'flex',
                            flexFlow: 'column',
                            justifyContent: 'space-between',
                            flexGrow: 1,
                            marginRight: '16px',
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                            <Flats />
                            <Lessees />
                        </div>
                        <Dashboard />
                    </div>
                    <Balance />
                </div>
            </div>
        </>
    );
};
