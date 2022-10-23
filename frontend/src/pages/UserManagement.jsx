
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from 'formik';
import { useCookies } from 'react-cookie';
import Footer from '../components/Footer';
import UpdateUsername from '../components/UserManagement/UpdateUsername';
import UpdatePassword from '../components/UserManagement/UpdatePassword';
import UpdateEmail from "../components/UserManagement/UpdateEmail";
// import '../styles/Home.css'

export default function UserManagement() {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username']);
    const [page, setPage] = useState('user');

    // Responsive navigation handling
    useEffect(() => {
        if (page === 'home') {
            navigate('/');
        }
    });

    // Delete user function
    async function deleteAccount() {
        let passwordConf = prompt("Enter Password to Confirm Deletion:");

        const userObject = {
            uuid: cookies.uuid,
            password: passwordConf,
            token: cookies.token,
        }


        if (confirm("DELETE ACCOUNT?")) {
            await fetch(window.$serverURL + '/user/delete', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: window.$generateForm(userObject)
            });

            setCookie('uuid', null);
            setCookie('username', null);
            setCookie('token', null);
            setPage('home');
        }
    }

    return (
        <>
            <h1>User Management</h1>
            <div className="userPane">
                <p className="username">Username: {cookies.username}</p>
                <button className="changePasswordButton" onClick={() => { document.getElementById('passwordChangePane').hidden = false }}>Change Password</button>
                <button className="changeUsernameButton" onClick={() => { document.getElementById('userChangePane').hidden = false }}>Change Username</button>
                <button className="changeEmailButton" onClick={() => { document.getElementById('emailChangePane').hidden = false }}>Change Email</button>
                <button className="deleteAccountButton" onClick={() => { deleteAccount() }}>Delete Account</button>
            </div>
            <div id="userChangePane" hidden={true}>
                <UpdateUsername />
            </div>
            <div id="passwordChangePane" hidden={true}>
                <UpdatePassword />
            </div>
            <div id="emailChangePane" hidden={true}>
                <UpdateEmail />
            </div>
        </>
    );
}