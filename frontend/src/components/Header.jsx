import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from 'react-cookie';
// import Footer from '../components/Footer';
// import '../styles/Home.css'

export default function Header() {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username']);
    const [page, setPage] = useState('user');
    const serverURL = "http://localhost:3000";

    // Responsive navigation handling
    useEffect(() => {
        if (page === 'home') {
            navigate('/');
        }
    });

    return (
        <>
            <header className="siteHeader">Header Links</header>
        </>
    );
}