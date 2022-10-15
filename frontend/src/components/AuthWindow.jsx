import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';


export default function AuthWindow(props) {
    const navigate = useNavigate();
    const [page, setPage] = useState('home');
    const [authType, setAuthType] = useState("login");

    useEffect(() => {
        if (page === 'servers') {
            navigate('/servers');
        }
    });

    function AuthenticationWindow() {
        if (authType === "login") {
            return (
                <>
                    <LoginWindow />
                    <button onClick={() => {
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
            <div className="authTitle">
                <h3>Login or Sign-Up</h3>
                <AuthenticationWindow />
            </div>

        </>
    );
}


function LoginWindow() {

    const ErrorSchema = Yup.object().shape({
        email: Yup.string().email('Invalid email').required('Required'),
        password: Yup.string()
            .min(2, 'Too Short!')
            .max(50, 'Too Long!')
            .required('Required'),
    });

    function handleSignIn(formData) {
        console.log("Handling Sign In for: " + formData.email);
        // POST request with username, password
        // If valid, store cookie, else throw error
    }

    return (
        <div className="authForm">
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                }}
                validationSchema={ErrorSchema}
                onSubmit={(values) => { handleSignIn(values) }}
            >
                {({ errors, touched }) => (
                    <Form>
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
        // POST request with username, password
        // If valid, store cookie, else throw error

        /* fetch('http://example.com/movies.json, {data})
            .then((response) => response.json())
            .then((data) => console.log(data));

        */
    }

    return (
        <div className="authForm">
            <Formik
                initialValues={{
                    email: "",
                    password: "",
                }}
                validationSchema={ErrorSchema}
                onSubmit={(values) => { handleSignUp(values) }}
            >
                {({ errors, touched }) => (
                    <Form>
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