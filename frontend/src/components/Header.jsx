import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
import '../styles/Header.css';
// import Footer from '../components/Footer';

export default function Header(props) {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username']);

    async function logout() {
        const userObject = {
            uuid: cookies.uuid,
            token: cookies.token,
        }

        await fetch(window.$serverURL + "/user/logout", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: window.$generateForm(userObject)
        });

        setCookie('uuid', null);
        setCookie('username', null);
        setCookie('token', null);
        navigate('/');
    }

    return (
        <>
            <header className="siteHeader">
                <section className="navbar">
                    <div className="leftEdge"><h2>Discord Clone</h2></div>
                    <div className="centerEdge"><h2>{props.title}</h2></div>
                    <div className="rightEdge">
                        <button className="logoutButton" onClick={() => { logout() }}>LOGOUT</button>
                        <button className="serverButton" onClick={() => { navigate('/servers') }}>SERVERS</button>
                        <h3 className="username">{cookies.username}</h3>
                    </div>
                </section>

            </header>
        </>
    );
}