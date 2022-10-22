import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
// import Footer from '../components/Footer';
// import '../styles/Home.css'

export default function Header() {
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
            <header className="siteHeader">Header Links
                <button className="logoutButton" onClick={() => {logout()}}>LOGOUT</button>            
            </header>
        </>
    );
}