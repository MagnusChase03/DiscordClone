import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from 'formik';
import { useCookies } from 'react-cookie';
import * as Yup from 'yup';
// import Footer from '../components/Footer';
// import UpdateUsername from '../components/UserManagement/UpdateUsername';
// import UpdatePassword from '../components/UserManagement/UpdatePassword';
// import '../styles/Home.css'

export default function UpdatePassword() {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username']);
    const [page, setPage] = useState('user');

    // Responsive navigation handling
    useEffect(() => {
        if (page === 'home') {
            navigate('/');
        }
    });

    async function changePassword(formData) {
        const userObject = {
            uuid: cookies.uuid,
            token: cookies.token,
            password: formData.password,
            newPassword: formData.newPassword
        }

        await fetch(window.$serverURL + '/user/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: window.$generateForm(userObject)
        });

        alert("Password changed!");
        setPage('home');
    }

    const ErrorSchema = Yup.object().shape({
        newPassword: Yup.string()
            .min(8, 'Too Short!')
            .max(128, 'Too Long!')
            .required('Required'),
        password: Yup.string().required('Required'),
    });

    return (
        <>
            <Formik
                initialValues={{
                    newPassword: "",
                    password: "",
                }}
                validationSchema={ErrorSchema}
                onSubmit={(values) => { changePassword(values) }}
            >
                {({ errors, touched }) => (
                    <Form className="authForm">
                        <Field id="password" name="password" placeholder="Password" type="password" />
                        <Field id="newPassword" name="newPassword" placeholder="New Password" type="password" />
                        {touched.newPassword && errors.newPassword && <div>{errors.newPassword}</div>}
                        <button type="submit" className="loginButton">Submit</button>
                    </Form>
                )}
            </Formik>
        </>
    );

}