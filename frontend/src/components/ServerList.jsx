
import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router";
import AddServer from './AddServer';

export default function ServerList() {
    const serverURL = "http://localhost:3000"
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username', 'usid', 'serverName']);
    const [servers, setServers] = useState([]);
    const [serverUpdate, setServerUpdate] = useState(0);
    const [page, setPage] = useState('home');
    const navigate = useNavigate();

    useEffect(() => {
        if (page === 'chat') {
            navigate('/chat');
        }
    });

    function selectServer(usid, servername) {
        console.log(usid);
        setCookie('usid', usid, [{ path: '/' }, { sameSite: true }]);
        setCookie('serverName', servername, [{ path: '/' }, { sameSite: true }]);
        setPage('chat');
    }

    useEffect(() => {
        fetch(serverURL + "/server", {
            method: 'GET',
            headers: {
                uuid: cookies.uuid,
                token: cookies.token,
            }
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data.servers);
                setServers(data.servers);
            });
    }, [serverUpdate]);

    return (
        <>
        <AddServer servers={serverUpdate} updateServers={setServerUpdate}/>
            <ul>
                {servers.map((server) => (
                    <li key={server.usid}>
                        <button onClick={() => {selectServer(server.usid, server.name)}}>{server.name}</button>
                    </li>
                ))}

                {servers.length === 0 && 'No Servers Found'}

            </ul>
        </>
    );
}