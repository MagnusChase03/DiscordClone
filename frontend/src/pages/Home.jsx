
import React, { useState, useEffect } from "react";
import Footer from '../components/Footer';
import AuthWindow from "../components/AuthWindow";
import '../styles/Home.css'

function Home() {
    const name="Discord Clone";

    return(
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