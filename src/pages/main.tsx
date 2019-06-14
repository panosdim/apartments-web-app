import React from 'react';
import { Flats } from '../components';
import { Header } from '../components/header';

export const Main: React.FC = () => {
    return (
        <>
            <Header />
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <Flats />
            </div>
        </>
    );
};
