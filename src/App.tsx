import React, { useState } from 'react';
import axios from 'axios';
import { useGlobal, setGlobal } from 'reactn';
import './App.css';
import { Main, Login } from './pages';
import { Spinner, Intent } from '@blueprintjs/core';

// TODO: Change to production REST API
axios.defaults.baseURL = 'http://localhost:8000/';
axios.defaults.headers.common['Authorization'] = 'Bearer ' + localStorage.getItem('token');

setGlobal({
    isLoggedIn: false,
    user: {},
});

const App: React.FC = () => {
    const [isLoggedIn, setLoggedIn] = useGlobal('isLoggedIn');
    const [, setUser] = useGlobal('user');
    const [isLoading, setLoading] = useState(true);

    React.useEffect(() => {
        axios
            .get('user')
            .then(response => {
                setLoggedIn(true);
                setLoading(false);
                setUser(response.data);
            })
            .catch(() => {
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
