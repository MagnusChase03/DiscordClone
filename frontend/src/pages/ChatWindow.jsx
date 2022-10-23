/*
    TODO
    - Fix messages not loading from other users
        - Need to do with server-side event sources to do it properly (https://medium.com/tokopedia-engineering/implementing-server-sent-events-in-reactjs-c36661d89468)
*/

import React, { useState, useEffect, useRef } from "react";
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router";
import { useEventSource, useEventSourceListener } from "@react-nano/use-event-source";
import SendMessage from "../components/SendMessage";
import MemberList from "../components/MemberList";
import Header from '../components/Header';
import '../styles/Chat.css';
//"http://localhost:3000/server/message/listen?uuid=" + cookies.uuid + "&usid=" + cookies.usid + "&token=" + cookies.token

function ChatWindow() {
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username', 'usid', 'serverName']);
    const [messages, setMessages] = useState([]);
    const [sentCount, setSentCount] = useState(0);
    const [page, setPage] = useState('chat');
    const navigate = useNavigate();
    const [eventSource, eventSourceStatus] = useEventSource("http://localhost:3000/server/message/listen?uuid=" + cookies.uuid + "&usid=" + cookies.usid + "&token=" + cookies.token, false);

    useEffect(() => {
        fetch(window.$serverURL + "/server/message", {
            method: 'GET',
            headers: {
                uuid: cookies.uuid,
                token: cookies.token,
                usid: cookies.usid,
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setMessages(data.messages);
            });

    }, []);

    useEventSourceListener(eventSource, ['message'], evt => {
        let data = JSON.parse(evt.data);
        let newMessages = [...messages];
        newMessages.push(data);

        setMessages(newMessages);
    }, [messages]);

    const messagesEndRef = useRef(null)
    const Messages = ({ messages }) => {


        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView()
        }

        useEffect(() => {
            scrollToBottom()
        }, [messages]);
    }

    async function leaveServer() {
        const serverObject = {
            uuid: cookies.uuid,
            token: cookies.token,
            usid: cookies.usid
        }
        if (confirm("LEAVE SERVER?")) {

            await fetch(window.$serverURL + '/server/leave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: window.$generateForm(serverObject)
            });
            navigate('/');
        }
    }

    return (
        <>
            <Header title={cookies.serverName} />

            <div className="chatPage">
                <div className="serverInfo">
                    <MemberList />
                    <button className="leaveServerButton" onClick={() => { leaveServer() }}>Leave Server</button>
                </div>

                <div className="chatFunctions">
                    <div className="chatWindow">
                        {messages.map((message) => {
                            if (message.user == cookies.uuid) {
                                return (
                                    <div key={message.umid} className="messageContainerUser">
                                        {/* <p className="messageSender">{message.user}:</p> */}
                                        <p className="messageContent">{message.content}</p>
                                    </div>
                                );
                            }
                            else {
                                return (
                                    <div key={message.umid} className="messageContainerServer">
                                        <p className="messageSender">{message.username}:</p>
                                        <p className="messageContent">{message.content}</p>
                                    </div>
                                )
                            }

                        })}
                        {messages.length === 0 && <h1>👻 It's Spooky in here!</h1>}
                        <div ref={messagesEndRef} />
                    </div>
                    <SendMessage />
                </div>
                <Messages />
            </div>

        </>
    );
}

export default ChatWindow;