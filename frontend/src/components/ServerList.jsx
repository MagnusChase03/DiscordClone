/*
    TODO
    - Don't render until server GET fetch is complete
*/

import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router";
import AddServer from './AddServer';
import JoinServer from './JoinServer';
import '../styles/ServerSelect.css';

export default function ServerList() {
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username', 'usid', 'serverName']);
    const [servers, setServers] = useState([]);
    const [serverUpdate, setServerUpdate] = useState(0);
    const [ready, setReady] = useState(false);
    const navigate = useNavigate();

    function selectServer(usid, servername) {
        setCookie('usid', usid, [{ path: '/' }, { sameSite: true }]);
        setCookie('serverName', servername, [{ path: '/' }, { sameSite: true }]);
        navigate('/chat');
    }

    async function deleteServer(usid) {

        let passwordConf = prompt("Enter Password to Confirm Deletion:");

        const serverObject = {
            uuid: cookies.uuid,
            password: passwordConf,
            token: cookies.token,
            usid: usid
        }

        await fetch(window.$serverURL + "/server/delete", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: window.$generateForm(serverObject)
        });

        setServerUpdate(serverUpdate + 1);
    }

    async function getInvite(usid) {

        const joinObject = {
            uuid: cookies.uuid,
            token: cookies.token,
            usid: usid
        }

        let data = await fetch(window.$serverURL + "/server/invite", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: window.$generateForm(joinObject)
        });

        data = await data.json();
        alert("Server Invite Token: " + data.token);
    }

    useEffect(() => {
        fetch(window.$serverURL + "/server", {
            method: 'GET',
            headers: {
                uuid: cookies.uuid,
                token: cookies.token,
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setServers(data.servers);
                setReady(true);
            });
    }, [serverUpdate]);

    return (
        <>
            <JoinServer servers={serverUpdate} updateServers={setServerUpdate} />
            <AddServer servers={serverUpdate} updateServers={setServerUpdate} />
            <div className="serverList">

                {ready &&
                    <>
                        {servers.map((server) => {
                            if (server != null) {
                                return (
                                    <div key={server.usid} className="serverEntry">
                                        <div className="serverMeta">
                                            <p className="serverName">{server.name}</p>
                                            <p className="serverOwner">{server.owner}</p>
                                        </div>
                                        <button className="joinButton" onClick={() => { selectServer(server.usid, server.name) }}>JOIN</button>
                                        {server.owner == cookies.uuid && <button className="inviteButton" onClick={() => { getInvite(server.usid) }}>INVITE</button>}
                                        {server.owner == cookies.uuid && <button className="deleteButton" onClick={() => { deleteServer(server.usid) }}>DELETE</button>}
                                    </div>
                                )
                            }
                        })}
                        {servers.length === 0 && <h1>No Servers Found</h1>}
                    </>
                }


            </div>
        </>
    );
}