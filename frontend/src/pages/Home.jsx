
import React, { useState, useEffect } from "react";
import Footer from '../components/Footer';
import AuthWindow from "../components/AuthWindow";

function Home() {
    const name="Discord Clone";

    return(
        <>
            <h1>{name}</h1>
            <AuthWindow />
            {/* <Footer /> */}
        </>
    );
}

export default Home;