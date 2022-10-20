import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from 'formik';
import { useCookies } from 'react-cookie';
import * as Yup from 'yup';
import '../styles/AuthWindow.css';

export default function AuthWindow() {
    // ------ INIT VARIABLE ------
    const navigate = useNavigate();
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username']);
    const [page, setPage] = useState('home');
    const [authType, setAuthType] = useState("login");
    const serverURL = "http://localhost:3000"

    // Responsive navigation handling
    useEffect(() => {
        if (page === 'servers') {
            navigate('/servers');
        }
    });

    // ------ GENERATE POST REQUEST BODY ------
    function generateForm(object) {
        var formBody = [];
        for (var property in object) {
            var encodedKey = encodeURIComponent(property);
            var encodedValue = encodeURIComponent(object[property]);
            formBody.push(encodedKey + "=" + encodedValue);
        }
        formBody = formBody.join("&");
        return formBody;
    }

    // ------ HANDLE LOGIN ------
    function LoginWindow() {

        // Define error schema for data fields
        const ErrorSchema = Yup.object().shape({
            username: Yup.string().required('Required'),
            password: Yup.string()
                .required('Required'),
        });

        // Handle sign in with backend call
        async function handleSignIn(formData) {

            const loginObject = {
                username: formData.username,
                password: formData.password
            }

            var data = await fetch(serverURL + "/user/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: generateForm(loginObject),
            });

            console.log("User: " + formData.username);
            console.log("Password: " + formData.password);
            data = await data.json();
            if (data.Status == 'Ok') {
                setCookie('token', data.token, [{ path: '/' }, { sameSite: true }]);
                setPage("servers");
            }
        }

        // Create login HTML elements
        return (
            <div className="">
                <Formik
                    // Initial values for fields
                    initialValues={{
                        username: "",
                        password: "",
                    }}
                    validationSchema={ErrorSchema}
                    onSubmit={(values) => { handleSignIn(values) }}
                >
                    {({ errors, touched }) => (
                        <Form className="authForm">
                            <Field id="username" name="username" placeholder="Username" />
                            <Field id="password" name="password" placeholder="Password" type="password" />
                            {touched.password && errors.password && <div className="passwordErrors">{errors.password}</div>}
                            <button type="submit" className="loginButton">Login</button>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }

    // ------ HANDLE SIGN UP ------
    function SignUpWindow() {

        // Define error schema for signing up
        const ErrorSchema = Yup.object().shape({
            // email: Yup.string().email('Invalid email').required('Required'),
            email: Yup.string().email('Invalid email').required('Required'),
            username: Yup.string().required('Required'),
            password: Yup.string()
                .min(8, 'Too Short!')
                .max(128, 'Too Long!')
                .required('Required'),
        });

        // Handle sign up with backend
        function handleSignUp(formData) {
            // console.log("Handling Sign Up for: " + formData.email);
            const loginObject = {
                email: formData.email,
                username: formData.username,
                password: formData.password
            }

            fetch(serverURL + "/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: generateForm(loginObject),
            })
                .then((response) => response.json());
            // .then((data) => { console.log(data) });

            setAuthType("login");
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

    // ------- CREATE AUTH COMPONENT --------
    function AuthenticationWindow() {
        if (authType === "login") {
            return (
                <>
                    <LoginWindow />
                    <button className="signUpButton" onClick={() => {
                        setAuthType("signUp");
                    }}>Sign Up Instead</button>
                </>
            )
        }
        else {
            return (
                <>
                    <SignUpWindow />
                    <button className="signUpButton" onClick={() => {
                        setAuthType("login");
                    }}>Login Instead</button>
                </>
            );
        }
    }

    // ------ FINAL AUTH WINDOW ------
    return (
        <>
            <div className="authContainer">
                <h3>AUTHENTICATION REQUIRED</h3>
                <AuthenticationWindow />
            </div>

        </>
    );
}