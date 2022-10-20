import React, { useState, useEffect } from "react";
import { useCookies } from 'react-cookie';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';

export default function JoinServer(props) {
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

    async function joinServer(serverToken) {
        const joinObject = {
            uuid: cookies.uuid,
            token: cookies.token,
            serverToken: serverToken.serverToken
        }

        await fetch(serverURL + "/server/join", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            body: generateForm(joinObject)
        })
        console.log("JOINED SERVER");
        props.updateServers(props.servers + 1);
    }

    const ErrorSchema = Yup.object().shape({
        serverToken: Yup.string().required('Required'),
    });

    return (
        <>
            <Formik
                // Initial values for fields
                initialValues={{
                    serverToken: "",
                }}
                validationSchema={ErrorSchema}
                onSubmit={(values) => { joinServer(values); values.serverToken = ''; }}
            >
                {({ errors, touched }) => (
                    <Form className="serverForm">
                        <Field id="serverToken" name="serverToken" placeholder="Join Code" />
                        {touched.serverToken && errors.serverToken && <div className="serverNameErrors">{errors.serverToken}</div>}
                        <button type="submit">Join Server</button>
                    </Form>
                )}
            </Formik>

        </>
    );
}