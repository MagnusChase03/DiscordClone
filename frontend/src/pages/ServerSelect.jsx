
import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import ServerList from "../components/ServerList";
import Footer from '../components/Footer';
import Header from "../components/Header";


function ServerSelect() {
    const serverURL = "http://localhost:3000"
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username']);
    const [userStatus, setUserStatus] = useState(0);

    useEffect(() => {
        fetch(serverURL + "/user", {
            method: 'GET',
            headers: {
                'token': cookies.token
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setCookie('uuid', data.user.uuid, [{ path: '/' }, { sameSite: true }]);
                setCookie('username', data.user.username, [{ path: '/' }, { sameSite: true }]);
                setUserStatus(1);
            });
    }, []);

    if (userStatus != 0) {
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