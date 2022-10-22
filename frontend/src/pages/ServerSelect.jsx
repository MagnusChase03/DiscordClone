
import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import ServerList from "../components/ServerList";
import Footer from '../components/Footer';
import Header from "../components/Header";
import { useAsyncError } from "react-router-dom";

function ServerSelect() {
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username']);
    const [isReady, setReady] = useState(false);

    useEffect(() => {
        fetch(window.$serverURL + "/user", {
            method: 'GET',
            headers: {
                'token': cookies.token
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCookie('uuid', data.user.uuid, [{ path: '/' }, { sameSite: true }]);
                setCookie('username', data.user.username, [{ path: '/' }, { sameSite: true }]);
                setReady(true);
            });
    }, []);

    if (isReady) {
        return (
            <>
                <Header />
                <h1>SELECT A SERVER</h1>
                <p>User Authentication Token: {cookies.token}</p>
                <p>Unique User Identification Number: {cookies.uuid}</p>
                <p>Username: {cookies.username}</p>
                <ServerList />
                <Footer />
            </>
        );
    }
}

export default ServerSelect;