
import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router";
import SendMessage from "../components/SendMessage";

function ChatWindow() {
    const serverURL = "http://localhost:3000"
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username', 'usid', 'serverName']);
    const [messages, setMessages] = useState([]);
    const [sentCount, setSentCount] = useState(0);
    const [page, setPage] = useState('home');
    const navigate = useNavigate();

    useEffect(() => {
        fetch(serverURL + "/server/message", {
            method: 'GET',
            headers: {
                uuid: cookies.uuid,
                token: cookies.token,
                usid: cookies.usid,
            }
        })
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                setMessages(data.messages);
            });
    }, [sentCount]);


    return (
        <>
            <h1>{cookies.serverName}</h1>
            <ul>
                {messages.map((message) => (
                    <li key={message.umid}>
                        <p>{message.content}</p>
                    </li>
                ))}

                {messages.length === 0 && 'Nobody Here'}

            </ul>
            <SendMessage messages={sentCount} updateMessages={setSentCount} />
        </>
    );
}

export default ChatWindow;