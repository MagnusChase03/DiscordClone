import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import '../styles/ServerSelect.css';


export default function MemberList() {
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'usid']);
    const [members, setMembers] = useState([]);

    async function getMembers() {
        var data = await fetch(window.$serverURL + "/server", {
            method: 'GET',
            headers: {
                uuid: cookies.uuid,
                token: cookies.token,
                usid: cookies.usid,
            }
        })
        data = await data.json();
        console.log(data);
        setMembers(data.server.usernames);
    }

    useEffect(() => {
        getMembers();
    }, []);

    return (
        <>
            <h4>Members</h4>
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