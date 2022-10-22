import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from 'formik';
import { useCookies } from 'react-cookie';
import * as Yup from 'yup';
// import Footer from '../components/Footer';
// import UpdateUsername from '../components/UserManagement/UpdateUsername';
// import UpdatePassword from '../components/UserManagement/UpdatePassword';
// import '../styles/Home.css'

export default function UpdateUsername() {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username']);
    const [page, setPage] = useState('user');

    // Responsive navigation handling
    useEffect(() => {
        if (page === 'home') {
            navigate('/');
        }
    });

    async function changeUsername(formData) {
        const userObject = {
            uuid: cookies.uuid,
            token: cookies.token,
            password: formData.password,
            username: formData.newUsername
        }

        await fetch(window.$serverURL + '/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: window.$generateForm(userObject)
        });

        setCookie('username', userObject.username);
        alert("Username changed!");
        setPage('home');
    }

    const ErrorSchema = Yup.object().shape({
        newUsername: Yup.string().required('Required'),
        password: Yup.string().required('Required'),
    });

    return (
        <>
            <Formik
                initialValues={{
                    newUsername: "",
                    password: "",
                }}
                validationSchema={ErrorSchema}
                onSubmit={(values) => { changeUsername(values) }}
            >
                {({ errors, touched }) => (
                    <Form className="authForm">
                        <Field id="newUsername" name="newUsername" placeholder="Username" />
                        <Field id="password" name="password" placeholder="Password" type="password" />
                        {touched.password && errors.password && <div>{errors.password}</div>}
                        <button type="submit" className="loginButton">Submit</button>
                    </Form>
                )}
            </Formik>
        </>
    );

}