
import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import '../styles/ServerSelect.css';

export default function AddServer(props) {

    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username']);
    
    function createServer(data) {
        const serverObject = {
            uuid: cookies.uuid,
            token: cookies.token,
            name: data.name
        }

        fetch(window.$serverURL + "/server", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: window.$generateForm(serverObject),
        })
            .then((response) => response.json());
            // .then((data) => { console.log(data) });

        props.updateServers(props.servers + 1);
    }


    const ErrorSchema = Yup.object().shape({
        name: Yup.string().required('Required'),
    });

    return (
        <>
            <Formik
                // Initial values for fields
                initialValues={{
                    name: "",
                }}
                validationSchema={ErrorSchema}
                onSubmit={(values) => { createServer(values); values.name = ''; }}
            >
                {({ errors, touched }) => (
                    <Form className="serverForm">
                        <Field id="name" name="name" placeholder="Server Name" />
                        {touched.name && errors.name && <div className="serverNameErrors">{errors.name}</div>}
                        <button type="submit">Create Server</button>
                    </Form>
                )}
            </Formik>

        </>
    );
}