/*
    Title: Sign Up Component
    Author: Kevin Harvey
    Date: 20221022
    Overview: Sign up form component. On submit it calls sign up on backend, then does a sign-in with redirection to server selection.
*/

import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from 'formik';
import { useCookies } from 'react-cookie';
import * as Yup from 'yup';

export default function SignUp() {
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username']);

    // Define error schema for signing up
    const ErrorSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
        username: Yup.string().required('Required'),
        password: Yup.string()
            .min(8, 'Too Short!')
            .max(128, 'Too Long!')
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
            setCookie('token', data.token, [{ path: '/' }, { sameSite: true }]);
            navigate('/servers');
        }
    }

    // Handle sign up with backend
    async function handleSignUp(formData) {
        const loginObject = {
            email: formData.email,
            username: formData.username,
            password: formData.password
        }

        let data = await fetch(window.$serverURL + "/user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: window.$generateForm(loginObject),
        });

        data = await data.json();
        if (data.Status == 'Ok') {
            alert('ACCOUNT CREATION SUCCESSFUL');
            handleSignIn(formData);
        }
    }

    // Build form HTML
    return (
        <div className="">
            <Formik
                initialValues={{
                    email: "",
                    username: "",
                    password: "",
                }}
                validationSchema={ErrorSchema}
                onSubmit={(values) => { handleSignUp(values) }}
            >
                {({ errors, touched }) => (
                    <Form className="authForm">
                        <Field id="email" name="email" placeholder="name@example.com" type="email" />
                        <Field id="username" name="username" placeholder="Username" />
                        <Field id="password" name="password" placeholder="Password" type="password" />
                        {touched.password && errors.password && <div>{errors.password}</div>}
                        <button type="submit" className="loginButton">Sign Up</button>
                    </Form>
                )}
            </Formik>
        </div>
    );

}