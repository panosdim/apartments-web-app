import React from 'react';
import { Flats, Lessees, Balance } from '../components';
import { Header } from '../components/header';

export const Main: React.FC = () => {
    return (
        <>
            <div style={{ display: 'flex', flexFlow: 'column', height: '100%' }}>
                <Header />
                <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px' }}>
                    <Flats />
                    <Lessees />
                    <Balance />
                </div>
            </div>
        </>
    );
};
