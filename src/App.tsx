import React, { useState } from 'react';
import axios from 'axios';
import { useGlobal, setGlobal } from 'reactn';
import './App.css';
import { Main, Login } from './pages';
import { Spinner, Intent } from '@blueprintjs/core';

// TODO: Change to production REST API
axios.defaults.baseURL = 'http://api.moneytrack.cc.nf/';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

setGlobal({
    isLoggedIn: false,
});

const App: React.FC = () => {
    const [isLoggedIn, setLoggedIn] = useGlobal('isLoggedIn');
    const [isLoading, setLoading] = useState(true);

    React.useEffect(() => {
        axios
            .get('user')
            .then(response => {
                setLoggedIn(true);
                setLoading(false);
            })
            .catch(error => {
                setLoggedIn(false);
                setLoading(false);
            });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            {isLoading ? (
                <div className='center'>
                    <Spinner intent={Intent.PRIMARY} size={100} />
                </div>
            ) : isLoggedIn ? (
                <Main />
            ) : (
                <Login />
            )}
        </>
    );
};

export default App;
