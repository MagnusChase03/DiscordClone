
import React, { useState, useEffect, useRef } from "react";
import { useCookies } from 'react-cookie';
import { redirect, useNavigate } from "react-router";
import SendMessage from "../components/SendMessage";
import Footer from '../components/Footer';
import MemberList from "../components/MemberList";
import '../styles/Chat.css';

function ChatWindow() {
    const serverURL = "http://localhost:3000"
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username', 'usid', 'serverName']);
    const [messages, setMessages] = useState([]);
    const [sentCount, setSentCount] = useState(0);
    const [page, setPage] = useState('chat');
    const navigate = useNavigate();

    useEffect(() => {
        if (page === 'home') {
            navigate('/');
        }
    });

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

        await fetch(serverURL + '/server/leave', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: generateForm(serverObject)
        });
        setPage('home');
    } 

    return (
        <>
            <h1>{cookies.serverName}</h1>
            <MemberList />
            <button onClick={() => {leaveServer()}}>LEAF</button>
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
            <SendMessage messages={sentCount} updateMessages={setSentCount} />
            <Messages />
            {/* <Footer /> */}
        </>
    );
}

export default ChatWindow;