import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import '../styles/AuthWindow.css';

export default function AuthWindow(props) {
    const navigate = useNavigate();
    const [page, setPage] = useState('home');
    const [authType, setAuthType] = useState("login");
    const serverURL = "http://localhost:3000"

    // Responsive navigation handling
    useEffect(() => {
        if (page === 'servers') {
            navigate('/servers');
        }
    });

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

    // Login form and handling
    function LoginWindow() {

        const ErrorSchema = Yup.object().shape({
            email: Yup.string().email('Invalid email').required('Required'),
            password: Yup.string()
                .required('Required'),
        });

        function handleSignIn(formData) {
            console.log("Handling Sign In for: " + formData.email);

            const loginObject = {
                username: formData.email,
                password: formData.password
            }

            fetch(serverURL + "/user/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: generateForm(loginObject),
            })
                .then((response) => response.json())
                .then((data) => { console.log(data) });
            setPage("servers");
        }

        return (
            <div className="">
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validationSchema={ErrorSchema}
                    onSubmit={(values) => { handleSignIn(values) }}
                >
                    {({ errors, touched }) => (
                        <Form className="authForm">
                            <Field id="email" name="email" placeholder="name@example.com" type="email" />
                            <Field id="password" name="password" placeholder="Password" type="password" />
                            {touched.password && errors.password && <div>{errors.password}</div>}
                            <button type="submit">Login</button>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }

    // Sign up form and handling
    function SignUpWindow() {

        const ErrorSchema = Yup.object().shape({
            email: Yup.string().email('Invalid email').required('Required'),
            password: Yup.string()
                .min(8, 'Too Short!')
                .max(128, 'Too Long!')
                .required('Required'),
        });

        function handleSignUp(formData) {
            console.log("Handling Sign Up for: " + formData.email);
            const loginObject = {
                email: formData.email,
                username: formData.email,
                password: formData.password
            }

            fetch(serverURL + "/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
                },
                body: generateForm(loginObject),
            })
                .then((response) => response.json())
                .then((data) => { console.log(data.token) });

            setPage("servers");
        }

        return (
            <div className="">
                <Formik
                    initialValues={{
                        email: "",
                        password: "",
                    }}
                    validationSchema={ErrorSchema}
                    onSubmit={(values) => { handleSignUp(values) }}
                >
                    {({ errors, touched }) => (
                        <Form className="authForm">
                            <Field id="email" name="email" placeholder="name@example.com" type="email" />
                            <Field id="password" name="password" placeholder="Password" type="password" />
                            {touched.password && errors.password && <div>{errors.password}</div>}
                            <button type="submit">Sign Up</button>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }

    // Programatically modified authentication window
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
            return <SignUpWindow />
        }
    }

    return (
        <>
            <div className="authContainer">
                <h3>Login or Sign-Up</h3>
                <AuthenticationWindow />
            </div>

        </>
    );
}