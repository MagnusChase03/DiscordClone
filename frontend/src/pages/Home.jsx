
import React, { useState, useEffect } from "react";
import Footer from '../components/Footer';
import AuthWindow from "../components/AuthWindow";

function Home() {

    return(
        <>
            <h1>WELCOME</h1>
            <AuthWindow />
            {/* <Footer /> */}
        </>
    );
}

export default Home;