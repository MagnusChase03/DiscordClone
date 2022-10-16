
import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router";
import AddServer from './AddServer';
import '../styles/ServerSelect.css';

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
        // console.log(usid);
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
                // console.log(data.servers);
                setServers(data.servers);
            });
    }, [serverUpdate]);

    return (
        <>
            <AddServer servers={serverUpdate} updateServers={setServerUpdate} />
            <div className="serverList">
                {servers.map((server) => (
                    <div key={server.usid} className="serverEntry">
                        <div className="serverMeta">
                            <p>Name: {server.name}</p>
                            <p>Owner: {server.owner}</p>
                        </div>
                        <button onClick={() => { selectServer(server.usid, server.name) }}>JOIN</button>
                    </div>
                ))}

                {servers.length === 0 && 'No Servers Found'}

            </div>
        </>
    );
}