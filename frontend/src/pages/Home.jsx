/* 
    TODO
    - Automatically go to servers if cookies present
*/

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Footer from '../components/Footer';
import AuthWindow from "../components/AuthWindow";
import '../styles/Home.css'

function Home() {
    const [cookies, setCookie] = useCookies(['token']);
    const navigate = useNavigate();
    const name = "Discord Clone";

    async function getUser() {
        let data = await fetch(window.$serverURL + "/user", {
            method: 'GET',
            headers: {
                token: cookies.token,
            }
        });

        data = await data.json();
        if (data.Status == 'Ok') {
            navigate('/servers');
        }
    }

    useEffect(() => {
        getUser();
    }, []);

    return (
        <>
            <div className="titleBar">
                <h1 className="title">{name}</h1>
            </div>
            <AuthWindow />
            <Footer />
        </>
    );
}

export default Home;