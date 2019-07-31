import React from 'react';
import { Flats, Lessees, Balance } from '../components';
import { Header } from '../components/header';

export const Main: React.FC = () => {
    return (
        <>
            <div style={{ display: 'flex', flexFlow: 'column', height: '100vh' }}>
                <Header />
                <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '16px' }}>
                    <Flats />
                    <Lessees />
                </div>
                <div style={{ flexGrow: 1, display: 'flex', justifyContent: 'space-around', marginBottom: '16px' }}>
                    <Balance />
                </div>
            </div>
        </>
    );
};
