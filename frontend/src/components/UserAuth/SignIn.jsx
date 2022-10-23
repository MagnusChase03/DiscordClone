/*
    Title: Sign In Component
    Author: Kevin Harvey
    Date: 20221022
    Overview: Exports a login form used to authenticate the user. On submission, it attempts auth with the backend. Success results in re-direction to server select.
*/

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from 'formik';
import { useCookies } from 'react-cookie';
import * as Yup from 'yup';

export default function SignIn() {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['token']);
    const [errorMsg, setErrorMsg] = useState(<></>);


    // Define error schema for data fields
    const ErrorSchema = Yup.object().shape({
        email: Yup.string().email().required('Required'),
        password: Yup.string()
            .required('Required'),
    });

    // Handle sign in with backend call
    async function handleSignIn(formData) {
        const loginObject = {
            email: formData.email,
            password: formData.password
        }

        var data = await fetch(window.$serverURL + "/user/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: window.$generateForm(loginObject),
        });

        data = await data.json();

        if (data.Status == 'Ok') {
            // On successful auth
            setCookie('token', data.token, [{ path: '/' }, { sameSite: true }]);
            navigate('/servers');
        }
        else {
            // On failed auth
            setErrorMsg(<><p>Invalid Credentials</p></>);
        }
    }

    // Create login HTML elements
    return (
        <div className="">
            <Formik
                // Initial values for fields
                initialValues={{
                    email: "",
                    password: "",
                }}
                validationSchema={ErrorSchema}
                onSubmit={(values) => { handleSignIn(values) }}
            >
                {({ errors, touched }) => (
                    <Form className="authForm">
                        <Field id="email" name="email" placeholder="user@example.com" type="email" />
                        <Field id="password" name="password" placeholder="Password" type="password" />
                        {errorMsg}
                        {touched.password && errors.password && <div className="passwordErrors">{errors.password}</div>}
                        <button type="submit" className="loginButton">Login</button>
                    </Form>
                )}
            </Formik>
        </div>
    );

}