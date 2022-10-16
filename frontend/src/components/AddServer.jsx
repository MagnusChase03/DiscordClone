
import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

export default function AddServer(props) {
    const serverURL = "http://localhost:3000"
    const [cookies, setCookie] = useCookies(['token', 'uuid', 'username']);

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

    
    function createServer(data) {
        const serverObject = {
            uuid: cookies.uuid,
            token: cookies.token,
            name: data.name
        }

        fetch(serverURL + "/server", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: generateForm(serverObject),
        })
            .then((response) => response.json())
            .then((data) => { console.log(data) });

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
                onSubmit={(values) => { createServer(values) }}
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