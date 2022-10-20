
import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router";
import AddServer from './AddServer';
import JoinServer from './JoinServer';
import '../styles/ServerSelect.css';

export default function ServerList() {
    const serverURL = "http://localhost:3000"
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username', 'usid', 'serverName']);
    const [servers, setServers] = useState([]);
    const [serverUpdate, setServerUpdate] = useState(0);
    const [page, setPage] = useState('home');
    const navigate = useNavigate();

    function generateForm(object) {
        var formBody = [];
        for (var property in object) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(object[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        return formBody;
    }

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

    async function deleteServer(usid) {
        
        let passwordConf = prompt("Enter Password to Confirm Deletion:");
        
        const serverObject = {
            uuid: cookies.uuid,
            password: passwordConf,
            token: cookies.token,
            usid: usid
        }
        
        await fetch(serverURL + "/server/delete", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: generateForm(serverObject)
        });

        setServerUpdate(serverUpdate + 1);
    }

    async function getInvite(usid) {
        
        const joinObject = {
            uuid: cookies.uuid,
            token: cookies.token,
            usid: usid
        }
        
        let data = await fetch(serverURL + "/server/invite", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: generateForm(joinObject)
        });

        data = await data.json();
        console.log(data);
        alert("Server Invite Token: " + data.token);
        // setServerUpdate(serverUpdate + 1);
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

    if (servers != null) {
        return (
            <>
                <JoinServer servers={serverUpdate} updateServers={setServerUpdate} />
                <AddServer servers={serverUpdate} updateServers={setServerUpdate} />
                <div className="serverList">
                    {servers.map((server) => {
                        if (server == null) {
                            return (
                                <div key={'nullOption'}>
                                    <h1 key={'nullOption'}>No Servers Found</h1>
                                </div>
                            )
                        }
                        else {
                            return (
                                <div key={server.usid} className="serverEntry">
                                    <div className="serverMeta">
                                        <p>Name: {server.name}</p>
                                        <p>Owner: {server.owner}</p>
                                    </div>
                                    <button onClick={() => { selectServer(server.usid, server.name) }}>JOIN</button>
                                    <button onClick={() => { getInvite(server.usid) }}>INVITE</button>
                                    <button onClick={() => { deleteServer(server.usid) }}>DELETE</button>
                                </div>
                            )
                        }
                    }
                    )}

                    {servers.length === 0 && <h1>No Servers Found</h1>}

                </div>
            </>
        );
    }
}