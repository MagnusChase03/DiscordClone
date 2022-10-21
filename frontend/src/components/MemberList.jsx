import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import '../styles/ServerSelect.css';


export default function MemberList() {
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'usid']);
    const [members, setMembers] = useState([]);

    const serverURL = "http://localhost:3000";

    async function getMembers() {
        var data = await fetch(serverURL + "/server", {
            method: 'GET',
            headers: {
                uuid: cookies.uuid,
                token: cookies.token,
                usid: cookies.usid,
            }
        })
        data = await data.json();
        setMembers(data.server.usernames);
    }
    
    useEffect(() => {
        getMembers();
    }, []);
    
    return (
        <>
            <ul>
                {members.map((member) => (
                    <li key={member}>{member}</li>
                ))}
            </ul>
        </>
    );
}

async function loadData() {

}